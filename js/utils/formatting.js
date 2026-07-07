export function toFixedClean(value, decimals = 2) {
  return Number(value.toFixed(decimals)).toString();
}
