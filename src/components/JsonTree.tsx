import React from "react";
import TreeView, { INode } from "react-accessible-treeview";
import classnames from "classnames";

import { getSizeThreshold, humanizeSize } from "@/utils";

import styles from "./JsonTree.module.scss";

type JsonTreeData = unknown;

function convertNestedObjectToTree(data: JsonTreeData) {
  const nodes: INode[] = [];
  const nodesData: Record<number, unknown> = {};
  let index = 0;

  const createIndex = () => {
    return index++;
  };

  const traverse = (
    name: string,
    obj: JsonTreeData,
    parentId: number | null
  ): INode => {
    const id = createIndex();

    const node = {
      id,
      name,
      parent: typeof parentId === "number" ? parentId : null,
      children: [] as number[],
    };

    nodesData[id] = obj;
    nodes.push(node);

    const isObject = typeof obj === "object" && obj !== null;
    node.children = isObject
      ? Object.entries(obj)
          .map(([key, value]) => {
            return traverse(key, value, id);
          })
          .map((node) => node.id)
      : [];

    return node;
  };

  traverse("root", data, null);

  return { nodes, nodesData };
}

export default function BaseJsonTree({ data }: { data: JsonTreeData }) {
  const { nodes, nodesData } = convertNestedObjectToTree(data);

  return (
    <TreeView
      data={nodes}
      className={styles.tree}
      nodeRenderer={({
        element,
        getNodeProps,
        isExpanded,
        isSelected,
        isBranch,
        handleExpand,
      }) => {
        const value = nodesData[element.id];
        const isPrimitiveValue = isPrimitiveType(value);
        const lengthLabel = getLengthLabel(value);
        const showSize = !isPrimitiveValue || typeof value === "string";
        const size = JSON.stringify(value).length;
        const sizeThreshold = getSizeThreshold(size);

        console.log(element.name, isExpanded, isSelected);
        console.log(element.name, value);

        return (
          <div
            {...getNodeProps({ onClick: handleExpand })}
            className={classnames(styles.objectPropertyHeader, {
              [styles.objectPropertyIsExpandable]: isBranch,
              [styles.objectPropertySizeSmall]: sizeThreshold === "small",
              [styles.objectPropertySizeMedium]: sizeThreshold === "medium",
              [styles.objectPropertySizeLarge]: sizeThreshold === "large",
            })}
          >
            <div className={styles.caret}>
              {isBranch && (isExpanded ? "▼" : "▶")}
            </div>
            <div className={styles.objectPropertyKey}>{element.name}</div>
            {lengthLabel && (
              <div className={styles.objectPropertyLength}>{lengthLabel}</div>
            )}
            {showSize && (
              <div className={styles.objectPropertySize}>
                <SizeLabel size={size} />
              </div>
            )}
            {isPrimitiveValue && <JsonTreeValue data={value} />}
          </div>
        );
      }}
    />
  );
}

export function JsonTreeValue(props: { data: JsonTreeData }) {
  const { data } = props;
  if (typeof data === "number") return JsonTreeNumber({ data });
  if (typeof data === "string") return JsonTreeString({ data });
  if (typeof data === "boolean") return JsonTreeBoolean({ data });
  if (data === null) return JsonTreeNull();
  return <div>JSON.stringify(data)</div>;
}

export function JsonTreeNull() {
  return <div className={styles.null}>null</div>;
}

export function JsonTreeNumber(props: { data: number }) {
  return <span className={styles.number}>{props.data}</span>;
}

const MaxStringSize = 10;
export function JsonTreeString(props: { data: string }) {
  const { data: fullString } = props;
  const str =
    fullString.length > MaxStringSize
      ? fullString.slice(0, MaxStringSize) + "…"
      : fullString;
  return (
    <span className={styles.string} title={fullString}>
      &quot;{str}&quot;
    </span>
  );
}

export function JsonTreeBoolean(props: { data: boolean }) {
  return (
    <span className={styles.boolean}>{props.data ? "true" : "false"}</span>
  );
}

/**
 * Returns "12 keys" for objects and "13 items" for arrays, "" for others.
 */
function getLengthLabel(data: JsonTreeData) {
  if (Array.isArray(data)) return `${data.length} items`;
  if (typeof data === "object" && data !== null)
    return `${Object.keys(data).length} keys`;
  return "";
}

function isPrimitiveType(data: JsonTreeData) {
  if (data === null) return true;
  if (typeof data === "number") return true;
  if (typeof data === "string") return true;
  if (typeof data === "boolean") return true;
  return false;
}

function SizeLabel({ size }: { size: number }) {
  const threshold = getSizeThreshold(size);
  return (
    <span
      className={classnames(styles.sizeLabel, {
        [styles.sizeLabelSmall]: threshold === "small",
        [styles.sizeLabelMedium]: threshold === "medium",
        [styles.sizeLabelLarge]: threshold === "large",
      })}
    >
      {humanizeSize(size, {
        unitShortcuts: false,
      })}
    </span>
  );
}
