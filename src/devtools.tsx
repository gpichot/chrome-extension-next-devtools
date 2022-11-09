import React from "react";
import ReactDOM from "react-dom/client";
import classnames from "classnames";

import "./globals.css";

import PropsRequestTable from "./components/PropsRequestTable";
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

function useDarkMode() {
  const [prefersDarkMode, setPrefersDarkMode] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    console.log(mediaQuery);
    setPrefersDarkMode(mediaQuery.matches);

    const onChange = (e: MediaQueryListEvent) => {
      setPrefersDarkMode(e.matches);
    };
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return prefersDarkMode;
}

function App() {
  const [pagePropsList, setPagePropsList] = React.useState<PagePropsRequest[]>(
    []
  );

  const prefersDarkMode = useDarkMode();

  React.useEffect(() => {
    emitter.addListener((request) => {
      setPagePropsList((list) => [...list, request]);
    });
  }, []);

  return (
    <div
      className={classnames(styles.app, {
        [styles.appDark]: prefersDarkMode,
      })}
    >
      {pagePropsList.length === 0 ? (
        <div>No props requests yet</div>
      ) : (
        <PropsRequestTable requests={pagePropsList} />
      )}
    </div>
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
      emitter.emit({
        url: `/${path}`,
        status: request.response.status,
        content: JSON.parse(content),
      });
    });
  }
});
