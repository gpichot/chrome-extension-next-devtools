import React from "react";
import ReactDOM from "react-dom/client";

import "./globals.css";

import JsonTree from "./components/JsonTree";

import styles from "./popup.module.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function App() {
  const [pageProps, setPageProps] = React.useState<string | null>(null);

  React.useEffect(() => {
    chrome.runtime.sendMessage({ type: "getTab" }, (message) => {
      const { pageProps } = message;
      setPageProps(pageProps);
    });
  }, []);

  const pagePropsOb = React.useMemo(() => {
    if (!pageProps) return null;
    return JSON.parse(pageProps);
  }, [pageProps]);

  if (!pagePropsOb) {
    return <div>Not a page with a table</div>;
  }

  return (
    <div className={styles.container}>
      <JsonTree data={pagePropsOb} />
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
