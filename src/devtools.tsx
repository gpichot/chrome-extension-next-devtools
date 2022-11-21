import React from "react";
import ReactDOM from "react-dom/client";
import browser from "webextension-polyfill";
import { DevtoolsNetwork } from "webextension-polyfill/namespaces/devtools_network";

import "./globals.css";
import "./devtools.css";

import DevToolsApp from "./components/DevToolsApp";
import { installStyles } from "./devtoolsStyles";
import { PagePropsRequest } from "./types";

type Listener = (request: PagePropsRequest) => void;

const emitter = {
  listeners: [] as Listener[],
  addListener: (listener: Listener) => {
    emitter.listeners.push(listener);
  },
  removeListener: (listener: Listener) => {
    emitter.listeners = emitter.listeners.filter((l) => l !== listener);
  },
  emit: (request: PagePropsRequest) => {
    emitter.listeners.forEach((listener) => listener(request));
  },
};

function App() {
  const [pagePropsList, setPagePropsList] = React.useState<
    Record<string, PagePropsRequest>
  >({});

  React.useEffect(() => {
    emitter.addListener((request) => {
      setPagePropsList((list) => ({
        ...list,
        [request.url]: request,
      }));
    });
  }, []);

  const themeName = browser.devtools.panels.themeName;

  return (
    <div data-theme={themeName}>
      <DevToolsApp
        requests={Object.values(pagePropsList)}
        themeName={browser.devtools.panels.themeName}
      />
    </div>
  );
}

const isDev = process.env.NODE_ENV === "development";
const panelNameSuffix = isDev ? "NextJS (Dev)" : "NextJS";

browser.devtools.panels
  .create(panelNameSuffix, "icon.png", "/src/panel.html")
  .then((panel) => {
    panel.onShown.addListener((window) => {
      const root = ReactDOM.createRoot(
        window.document.getElementById("root") as HTMLElement
      );
      root.render(<App />);

      installStyles(window.document);
    });
  });

browser.devtools.network.onNavigated.addListener((url) => {
  console.log("Navigated to: " + url);
});

browser.devtools.network.onRequestFinished.addListener(async (requestHar) => {
  const request = requestHar as DevtoolsNetwork.Request & HARFormatEntry;

  if (!request.request.url.includes("/_next/data")) return;

  // cut at /_next/data
  const url = request.request.url.split("/_next/data")[1];
  const path = url.split("/").slice(2).join("/");

  const [content] = await request.getContent();
  const json = JSON.parse(content) as {
    pageProps: unknown;
  } | null;

  if (!json?.pageProps) return;

  emitter.emit({
    url: `/${path}`,
    status: request.response.status,
    content: json,
  });
});
