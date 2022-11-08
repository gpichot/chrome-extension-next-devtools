import React from "react";
import ReactDOM from "react-dom/client";

import { humanizeSize } from "./utils";

type PagePropsRequest = {
  url: string;
  status: number;
  content: unknown;
};
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

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Status</th>
            <th>Content Size</th>
          </tr>
        </thead>
        <tbody>
          {pagePropsList.map((request) => (
            <tr key={request.url}>
              <td>{request.url}</td>
              <td>{request.status}</td>
              <td>{humanizeSize(JSON.stringify(request.content).length)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
    request.getContent((content) => {
      emitter.emit({
        url: request.request.url,
        status: request.response.status,
        content: JSON.parse(content),
      });
    });
  }
});
