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

async function retrievePageProps(tabId: number): Promise<unknown | null> {
  const tab = await browser.tabs.get(tabId);

  if (!tab.url?.startsWith("http")) return null;

  const response = await browser.scripting.executeScript({
    target: { tabId: tabId },
    func: getNextData,
  });

  const { result = null } = response?.length ? response[0] : {};

  if (!result) return null;

  const jsonOb = JSON.parse(result);
  return jsonOb.props.pageProps;
}

/**
 * This function is called when a tab is updated.
 *
 * It detects if the tab contains the __NEXT_DATA__ element and if so, it
 * updates the badge text with the size of the page props
 */
async function onTabUpdated(
  tabId: number,
  changeInfo: browser.Tabs.OnUpdatedChangeInfoType
) {
  if (changeInfo.status === "complete") {
    updateBadgeText(tabId);
  }
}

async function updateBadgeText(tabId: number) {
  const json = await retrievePageProps(tabId);

  if (!json) {
    browser.action.disable(tabId);
    return;
  } else {
    browser.action.enable(tabId);
  }

  const size = JSON.stringify(json).length;
  const humanizedSize = humanizeSize(size);
  const color = getColor(size);

  browser.action.setBadgeText({ text: humanizedSize, tabId });
  browser.action.setBadgeBackgroundColor({ color, tabId });
}

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await browser.tabs.query(queryOptions);
  return tab;
}

browser.runtime.onMessage.addListener((message) => {
  if (message.type !== "getTab") return;

  return getCurrentTab().then((tab) => {
    const tabId = tab?.id;

    if (!tabId) return { pageProps: null };

    return retrievePageProps(tabId).then((pageProps) => ({ pageProps }));
  });
});

browser.tabs.onUpdated.addListener(onTabUpdated);
