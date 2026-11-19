export type Direction = "up" | "down" | "flat";

export function directionOf(change: number): Direction {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "flat";
}

/** Percentage change, or null when it cannot be computed safely (missing or zero base). */
export function percentChange(
  current: number,
  previous: number | null,
): number | null {
  if (previous === null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function lastItems<T>(items: readonly T[], count: number): T[] {
  return count <= 0 ? [] : items.slice(-count);
}
