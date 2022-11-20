import browser from "webextension-polyfill";

import { getSizeThreshold, humanizeSize } from "./utils";

function getNextData() {
  return document.querySelector("#__NEXT_DATA__")?.textContent;
}

function getColor(size: number) {
  const threshold = getSizeThreshold(size);
  if (threshold === "small") return "green";
  if (threshold === "medium") return "orange";
  return "red";
}

const tabPageProps = new Map<number, string>();

async function onTabUpdated(
  tabId: number,
  changeInfo: browser.Tabs.OnUpdatedChangeInfoType
) {
  if (changeInfo.status !== "complete") return;

  const response = await browser.scripting.executeScript({
    target: { tabId: tabId },
    func: getNextData,
  });

  const { result = null } = response?.length ? response[0] : {};

  if (!result) {
    browser.action.disable(tabId);
    return;
  } else {
    browser.action.enable(tabId);
  }

  const json = JSON.stringify(JSON.parse(result).props.pageProps);
  const size = json.length;
  const humanizedSize = humanizeSize(size);
  const color = getColor(size);

  browser.action.setBadgeText({ text: humanizedSize, tabId });
  browser.action.setBadgeBackgroundColor({ color, tabId });

  tabPageProps.set(tabId, json);
}

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await browser.tabs.query(queryOptions);
  return tab;
}

const currentTab = { id: null as null | number };

getCurrentTab().then((tab) => {
  if (!tab?.id) return;
  if (currentTab.id) return;
  currentTab.id = tab.id;
});

browser.tabs.onActivated.addListener(({ tabId }) => {
  currentTab.id = tabId;
});

browser.runtime.onMessage.addListener((message) => {
  if (message.type !== "getTab") return;

  if (!currentTab.id) {
    return Promise.resolve({ pageProps: null });
  }

  const pageProps = tabPageProps.get(currentTab.id);
  return Promise.resolve({ pageProps });
});

browser.tabs.onUpdated.addListener(onTabUpdated);
browser.tabs.onRemoved.addListener((tabId: number) => {
  tabPageProps.delete(tabId);
});
