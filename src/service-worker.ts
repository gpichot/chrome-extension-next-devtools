import { humanizeSize } from "./utils";

function getNextData() {
  return document.querySelector("#__NEXT_DATA__")?.textContent;
}

function getColor(size: number) {
  if (size < 10 * 1024) {
    return "green";
  } else if (size < 100 * 1024) {
    return "yellow";
  } else {
    return "red";
  }
}

const tabPageProps = new Map<number, string>();

function onTabUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo) {
  if (changeInfo.status !== "complete") return;

  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      func: getNextData,
    },
    (response) => {
      const { result = null } = response?.length ? response[0] : {};

      if (!result) {
        chrome.action.disable(tabId);
        return;
      } else {
        chrome.action.enable(tabId);
      }

      const json = JSON.stringify(JSON.parse(result).props.pageProps);
      const size = json.length;
      const humanizedSize = humanizeSize(size);
      const color = getColor(size);

      chrome.action.setBadgeText({ text: humanizedSize, tabId });
      chrome.action.setBadgeBackgroundColor({ color, tabId });

      tabPageProps.set(tabId, json);
    }
  );
}

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const currentTab = { id: null as null | number };

getCurrentTab().then((tab) => {
  if (!tab?.id) return;
  if (currentTab.id) return;
  currentTab.id = tab.id;
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  currentTab.id = tabId;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getTab") {
    console.log("tab", currentTab.id);
    if (!currentTab.id) return sendResponse({ pageProps: null });
    const pageProps = tabPageProps.get(currentTab.id);
    sendResponse({ pageProps });
  }
});

chrome.tabs.onUpdated.addListener(onTabUpdated);
chrome.tabs.onRemoved.addListener((tabId: number) => {
  tabPageProps.delete(tabId);
});
