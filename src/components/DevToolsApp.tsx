import React from "react";

import PropsRequestTable from "@/components/PropsRequestTable";
import { PagePropsRequest } from "@/types";

import JsonTree from "./JsonTree";

import styles from "./DevToolsApp.module.scss";

export default function DevToolsApp({
  requests,
}: {
  requests: PagePropsRequest[];
}) {
  const [selectedRequest, setSelectedRequest] =
    React.useState<PagePropsRequest | null>(null);
  return (
    <div className={styles.masterDetail}>
      <div className={styles.master}>
        {requests.length === 0 ? (
          <div>No props requests yet</div>
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
      <div className={styles.detail}>
        {selectedRequest ? (
          <JsonTree data={selectedRequest.content.pageProps} />
        ) : (
          <div>Select a request to see details</div>
        )}
      </div>
    </div>
  );
}
