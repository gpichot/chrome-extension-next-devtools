import React from "react";

import { PagePropsRequest } from "@/types";
import { humanizeSize } from "@/utils";

type PropsRequestTableProps = {
  requests: PagePropsRequest[];
};

export default function PropsRequestTable({
  requests,
}: PropsRequestTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>URL</th>
          <th>Content Size</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.url}>
            <td>{request.url}</td>
            <td>{humanizeSize(JSON.stringify(request.content).length)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
