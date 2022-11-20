import React from "react";
import ReactDOM from "react-dom/client";
import browser from "webextension-polyfill";

import "./globals.css";

import JsonTree from "./components/JsonTree";

import styles from "./popup.module.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function App() {
  const [pageProps, setPageProps] = React.useState<string | null>(null);

  React.useEffect(() => {
    browser.runtime.sendMessage({ type: "getTab" }).then((message) => {
      const { pageProps } = message;
      setPageProps(pageProps);
    });
  }, []);

  const pagePropsOb = React.useMemo(() => {
    if (!pageProps) return null;
    return pageProps;
  }, [pageProps]);

  if (!pagePropsOb) {
    return <div>Not a page with props</div>;
  }

  return (
    <div className={styles.container}>
      <JsonTree autofocus data={pagePropsOb} />
    </div>
  );
}
root.render(
  <React.StrictMode>
    <div className={styles.popup}>
      <App />
    </div>
  </React.StrictMode>
);
