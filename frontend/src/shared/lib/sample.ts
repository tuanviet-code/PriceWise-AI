/**
 * Helpers for ILLUSTRATIVE sample data only. Used by the `*.sample.ts` files until the
 * backend API exists. Deterministic (seeded) so server and client render the same values.
 */

export const SAMPLE_UPDATED_AT = "2026-10-21T09:00:00+07:00";
export const SAMPLE_END_DATE = "2026-10-21";

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** `count` consecutive ISO dates (YYYY-MM-DD) ending at `endDate`, oldest first. */
export function datesEndingAt(endDate: string, count: number): string[] {
  const end = Date.parse(`${endDate}T00:00:00Z`);
  return Array.from({ length: count }, (_, i) =>
    new Date(end - (count - 1 - i) * 86_400_000).toISOString().slice(0, 10),
  );
}

interface ExtendOptions {
  /** Hand-written most recent values, oldest first. */
  known: readonly number[];
  /** Total number of daily values wanted. */
  total: number;
  /** Size of one price step. */
  step: number;
  /** Range of steps a change may span (applied going back in time). */
  minSteps: number;
  maxSteps: number;
  /** Change the value only every `holdDays` days (fuel prices move by adjustment). */
  holdDays: number;
  seed: number;
}

/** Prepends generated older values to `known` so that the series has `total` daily values. */
export function extendBackwards(options: ExtendOptions): number[] {
  const { known, total, step, minSteps, maxSteps, holdDays, seed } = options;
  const random = mulberry32(seed);
  const series = [...known];
  let offset = 0;
  while (series.length < total) {
    offset += 1;
    let value = series[0];
    if (offset % holdDays === 0) {
      const steps = minSteps + Math.floor(random() * (maxSteps - minSteps + 1));
      value = Math.max(step, value - steps * step);
    }
    series.unshift(value);
  }
  return series.slice(-total);
}
