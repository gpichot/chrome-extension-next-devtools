import React from "react";
import classnames from "classnames";

import { getSizeThreshold, humanizeSize } from "@/utils";

import styles from "./JsonTree.module.scss";

type JsonTreeData = unknown;

export default function JsonTree(props: { data: JsonTreeData }) {
  const { data } = props;
  if (typeof data === "number") return JsonTreeNumber({ data });
  if (typeof data === "string") return JsonTreeString({ data });
  if (typeof data === "boolean") return JsonTreeBoolean({ data });
  if (Array.isArray(data)) return JsonTreeArray({ data });
  if (data === null) return JsonTreeNull();
  if (typeof data === "object") {
    return JsonTreeObject({ data: data as Record<string, JsonTreeData> });
  }
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

export function JsonTreeArray(props: { data: unknown[] }) {
  return (
    <div className={styles.array}>
      {props.data.map((item, index) => (
        <JsonTreeObjectProperty key={index} name={index} value={item} />
      ))}
    </div>
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
        [styles.sizeLabelSmall]: threshold === 0,
        [styles.sizeLabelMedium]: threshold === 1,
        [styles.sizeLabelLarge]: threshold === 2,
      })}
    >
      {humanizeSize(size, {
        unitShortcuts: false,
      })}
    </span>
  );
}

function JsonTreeObjectProperty(props: {
  name: string | number;
  value: unknown;
}) {
  const { name, value } = props;
  const isPrimitiveValue = isPrimitiveType(value);
  const [expanded, setExpanded] = React.useState(isPrimitiveValue);

  const lengthLabel = getLengthLabel(value);
  const showSize = !isPrimitiveValue || typeof value === "string";
  const isExpandable = !isPrimitiveValue;
  const toggleExpanded = () => {
    if (isExpandable) setExpanded((expanded) => !expanded);
  };
  const size = JSON.stringify(value).length;
  const sizeThreshold = getSizeThreshold(size);
  return (
    <div
      className={classnames(styles.objectProperty, {
        [styles.objectPropertyOneLine]: isPrimitiveValue,
        [styles.objectPropertyIsExpandable]: isExpandable,
        [styles.objectPropertySizeSmall]: sizeThreshold === 0,
        [styles.objectPropertySizeMedium]: sizeThreshold === 1,
        [styles.objectPropertySizeLarge]: sizeThreshold === 2,
      })}
    >
      <div
        className={styles.objectPropertyHeader}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={toggleExpanded}
        onKeyDown={(e) => {
          if (e.key === "Enter") toggleExpanded();
        }}
      >
        <div className={styles.objectPropertyKey}>{name}</div>
        {lengthLabel && (
          <div className={styles.objectPropertyLength}>{lengthLabel}</div>
        )}
        {showSize && (
          <div className={styles.objectPropertySize}>
            <SizeLabel size={size} />
          </div>
        )}
      </div>
      <div
        className={classnames(styles.objectPropertyValue, {
          [styles.objectPropertyValueExpanded]: expanded,
        })}
      >
        <JsonTree data={value} />
      </div>
    </div>
  );
}

export function JsonTreeObject(props: { data: Record<string, unknown> }) {
  return (
    <div className={styles.object}>
      <div className={styles.objectBody}>
        {Object.entries(props.data).map(([key, value]) => (
          <JsonTreeObjectProperty key={key} name={key} value={value} />
        ))}
      </div>
    </div>
  );
}
