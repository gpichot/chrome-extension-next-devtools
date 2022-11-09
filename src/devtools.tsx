import React from "react";
import ReactDOM from "react-dom/client";
import classnames from "classnames";

import "./devtools.css";

import DevToolsApp from "./components/DevToolsApp";
import PropsRequestTable from "./components/PropsRequestTable";
import { installStyles } from "./devtoolsStyles";
import { PagePropsRequest } from "./types";

import styles from "./devtools.module.scss";

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
  const [pagePropsList, setPagePropsList] = React.useState<PagePropsRequest[]>(
    []
  );

  React.useEffect(() => {
    emitter.addListener((request) => {
      setPagePropsList((list) => [...list, request]);
    });
  }, []);

  React.useEffect(() => {
    const themeName = chrome.devtools.panels.themeName;

    document.body.classList.add(`themeName-${themeName}`);
  }, []);

  return (
    <DevToolsApp
      requests={pagePropsList}
      themeName={chrome.devtools.panels.themeName}
    />
  );
}

chrome.devtools.panels.create(
  "NextJS",
  "icon.png",
  "/src/panel.html",
  (panel) => {
    panel.onShown.addListener((window) => {
      const root = ReactDOM.createRoot(
        window.document.getElementById("root") as HTMLElement
      );
      root.render(<App />);

      installStyles(window.document);
    });
  }
);

chrome.devtools.network.onNavigated.addListener((url) => {
  console.log("Navigated to: " + url);
});
chrome.devtools.network.onRequestFinished.addListener((request) => {
  if (request.request.url.includes("/_next/data")) {
    // cut at /_next/data
    const url = request.request.url.split("/_next/data")[1];
    const path = url.split("/").slice(2).join("/");

    request.getContent((content) => {
      const json = JSON.parse(content);

      if (!json.pageProps) return;

      emitter.emit({
        url: `/${path}`,
        status: request.response.status,
        content: json,
      });
    });
  }
});
