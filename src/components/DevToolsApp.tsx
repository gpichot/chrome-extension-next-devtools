import React from "react";
import classnames from "classnames";

import PropsRequestTable from "@/components/PropsRequestTable";
import { PagePropsRequest } from "@/types";
import { humanizeSize } from "@/utils";

import JsonTree from "./JsonTree";

import styles from "./DevToolsApp.module.scss";

export default function DevToolsApp({
  requests,
  themeName,
}: {
  requests: PagePropsRequest[];
  themeName: string;
}) {
  const [selectedRequest, setSelectedRequest] =
    React.useState<PagePropsRequest | null>(null);

  const pageProps = selectedRequest?.content.pageProps;
  return (
    <div
      className={classnames(styles.masterDetail, {
        [styles.dark]: themeName === "dark",
      })}
    >
      <div className={styles.master}>
        {requests.length === 0 ? (
          <div className={styles.emptyMessageContainer}>
            <p>No props requests yet.</p>
          </div>
        ) : (
          <PropsRequestTable
            requests={requests}
            selectedRequest={selectedRequest}
            onSelectRequest={(request) =>
              setSelectedRequest((currentRequest) =>
                currentRequest === request ? null : request
              )
            }
          />
        )}
      </div>
      {selectedRequest && (
        <div className={styles.detail}>
          <div className={styles.detailHeader}>
            <h2>
              Page Props (
              {humanizeSize(JSON.stringify(pageProps).length, {
                unitShortcuts: false,
              })}
              )
            </h2>
          </div>
          <div className={styles.detailBody}>
            <JsonTree autofocus data={pageProps} />
          </div>
        </div>
      )}
    </div>
  );
}
