export const CHART_RANGES = [
  { value: "7d", label: "7 ngày", days: 7 },
  { value: "1m", label: "1 tháng", days: 30 },
  { value: "3m", label: "3 tháng", days: 90 },
] as const;

export type ChartRange = (typeof CHART_RANGES)[number]["value"];

export function daysForRange(range: ChartRange): number {
  return CHART_RANGES.find((r) => r.value === range)?.days ?? 7;
}
