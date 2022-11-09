const unitsShortcuts = ["o", "k", "M"];
const units = ["oc", "ko", "Mo"];
export function humanizeSize(size: number, { unitShortcuts = true } = {}) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const unitNames = unitShortcuts ? unitsShortcuts : units;
  const unit = unitNames[i];
  const value = (size / Math.pow(1024, i)).toFixed(0);
  return `${value}${unitShortcuts ? "" : " "}${unit}`;
}

export function getSizeThreshold(size: number) {
  if (size < 10 * 1024) return 0;
  if (size < 100 * 1024) return 1;
  return 2;
}
