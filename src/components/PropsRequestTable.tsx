import React from "react";
import classnames from "classnames";

import { PagePropsRequest } from "@/types";
import { getSizeThreshold, humanizeSize } from "@/utils";

import styles from "./PropsRequestTable.module.scss";

type PropsRequestTableProps = {
  requests: PagePropsRequest[];
  onSelectRequest?: (request: PagePropsRequest) => void;
  selectedRequest: PagePropsRequest | null;
};

function RequestRow({
  request,
  isSelected,
  onSelectRequest,
}: { request: PagePropsRequest; isSelected: boolean } & Pick<
  PropsRequestTableProps,
  "onSelectRequest"
>) {
  const size = JSON.stringify(request.content.pageProps).length;
  const sizeThreshold = getSizeThreshold(size);
  return (
    <tr
      className={classnames({
        [styles.requestRowSelected]: isSelected,
        [styles.requestRowSizeSmall]: sizeThreshold === "small",
        [styles.requestRowSizeMedium]: sizeThreshold === "medium",
        [styles.requestRowSizeLarge]: sizeThreshold === "large",
      })}
      onClick={() => onSelectRequest?.(request)}
    >
      <td>{request.url}</td>
      <td>{humanizeSize(size)}</td>
    </tr>
  );
}

export default function PropsRequestTable({
  requests,
  onSelectRequest,
  selectedRequest,
}: PropsRequestTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>URL</th>
          <th>Content Size</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <RequestRow
            key={request.url}
            request={request}
            isSelected={selectedRequest === request}
            onSelectRequest={onSelectRequest}
          />
        ))}
      </tbody>
    </table>
  );
}
