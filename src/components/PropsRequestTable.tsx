import React from "react";
import classnames from "classnames";

import { PagePropsRequest } from "@/types";
import { humanizeSize } from "@/utils";

import styles from "./PropsRequestTable.module.scss";

type PropsRequestTableProps = {
  requests: PagePropsRequest[];
  onSelectRequest?: (request: PagePropsRequest) => void;
  selectedRequest: PagePropsRequest | null;
};

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
          <tr
            key={request.url}
            className={classnames({
              [styles.requestRowSelected]: request === selectedRequest,
            })}
            onClick={() => onSelectRequest?.(request)}
          >
            <td>{request.url}</td>
            <td>{humanizeSize(JSON.stringify(request.content).length)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
