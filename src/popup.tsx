import React from "react";
import ReactDOM from "react-dom/client";

import { humanizeSize } from "./utils";

import styles from "./popup.module.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function App() {
  const [pageProps, setPageProps] = React.useState<string | null>(null);

  React.useEffect(() => {
    chrome.runtime.sendMessage({ type: "getTab" }, (message) => {
      console.log("message", message);
      const { pageProps } = message;
      setPageProps(pageProps);
    });
  }, []);

  const pagePropsOb = React.useMemo(() => {
    if (!pageProps) return null;
    return JSON.parse(pageProps);
  }, [pageProps]);

  console.log(pagePropsOb, pageProps);

  if (!pagePropsOb) {
    return <div>Not a page with a table</div>;
  }

  return (
    <div className={styles.container}>
      <table>
        <tbody>
          {Object.entries(pagePropsOb).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{humanizeSize(JSON.stringify(value).length)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
