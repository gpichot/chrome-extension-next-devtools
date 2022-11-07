export function humanizeSize(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const unit = ["o", "k", "M"][i];
  const value = (size / Math.pow(1024, i)).toFixed(0);
  return `${value}${unit}`;
}
