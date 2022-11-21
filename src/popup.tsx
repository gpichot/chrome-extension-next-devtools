import React from "react";
import ReactDOM from "react-dom/client";
import browser from "webextension-polyfill";

import "./globals.css";
import "./popup.css";

import JsonTree from "./components/JsonTree";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function useThemeMode() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        setTheme(e.matches ? "dark" : "light");
      });
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setTheme(isDark ? "dark" : "light");
  }, []);

  return theme;
}

function App() {
  const [pageProps, setPageProps] = React.useState<string | null>(null);

  React.useEffect(() => {
    browser.runtime.sendMessage({ type: "getTab" }).then((message) => {
      const { pageProps } = message;
      setPageProps(pageProps);
    });
  }, []);

  const theme = useThemeMode();

  if (!pageProps) {
    return <div>Not a page with props</div>;
  }

  return (
    <div data-theme={theme} className="popup">
      <JsonTree autofocus data={pageProps} />
    </div>
  );
}
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
