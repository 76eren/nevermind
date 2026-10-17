export function formatCount(count: number | string): string {
  const value = Number(count);

  if (value < 1000) {
    return value.toString();
  } else if (value < 1000000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return (value / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
}
