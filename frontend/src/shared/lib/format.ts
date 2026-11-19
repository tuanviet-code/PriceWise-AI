/** Display formatting for Vietnamese prices and dates. Pure and locale-independent. */

const MINUS = "−";
const TIME_ZONE = "Asia/Ho_Chi_Minh";
const WEEKDAYS = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
] as const;

function group(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** 146500000 -> "146.500.000" */
export function formatNumber(value: number): string {
  const rounded = Math.round(value);
  const body = group(String(Math.abs(rounded)));
  return rounded < 0 ? `${MINUS}${body}` : body;
}

/** 146500000 -> "146.500.000 đ" */
export function formatVnd(value: number, unit = "đ"): string {
  return `${formatNumber(value)} ${unit}`;
}

/** 250000 -> "+250.000 đ", -120 -> "−120 đ", 0 -> "0 đ" */
export function formatSignedVnd(value: number, unit = "đ"): string {
  const rounded = Math.round(value);
  const sign = rounded > 0 ? "+" : rounded < 0 ? MINUS : "";
  return `${sign}${group(String(Math.abs(rounded)))} ${unit}`;
}

/** 148500000 -> "148,5 tr đ" */
export function formatMillions(value: number): string {
  const millions = Math.round(value / 10_000) / 100;
  const [whole, fraction] = String(Math.abs(millions)).split(".");
  const body = fraction ? `${group(whole)},${fraction}` : group(whole);
  return `${millions < 0 ? MINUS : ""}${body} tr đ`;
}

/** Digits-only parse for price inputs such as "147.000.000". Returns null when not a whole number. */
export function parsePriceInput(text: string): number | null {
  const cleaned = text.replace(/[\s.,đ₫]/g, "");
  if (!/^\d+$/.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isSafeInteger(value) ? value : null;
}

interface DateParts {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  weekday: number;
}

const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  weekday: "short",
});

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Accepts an ISO date ("2026-10-21") or timestamp; date-only values are read as Vietnam local dates. */
function toParts(iso: string): DateParts | null {
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00+07:00` : iso,
  );
  if (Number.isNaN(date.getTime())) return null;
  const map: Record<string, string> = {};
  for (const part of partsFormatter.formatToParts(date)) {
    map[part.type] = part.value;
  }
  return {
    day: map.day,
    month: map.month,
    year: map.year,
    hour: map.hour,
    minute: map.minute,
    weekday: WEEKDAY_INDEX[map.weekday] ?? 0,
  };
}

/** "21/10" */
export function formatDayMonth(iso: string): string {
  const p = toParts(iso);
  return p ? `${p.day}/${p.month}` : "—";
}

/** "21/10/2026" */
export function formatDate(iso: string): string {
  const p = toParts(iso);
  return p ? `${p.day}/${p.month}/${p.year}` : "—";
}

/** "09:00, 21/10/2026" */
export function formatTimeDate(iso: string): string {
  const p = toParts(iso);
  return p ? `${p.hour}:${p.minute}, ${p.day}/${p.month}/${p.year}` : "—";
}

/** "Thứ Tư, 21/10/2026 · cập nhật 09:00" */
export function formatWeekdayDate(iso: string): string {
  const p = toParts(iso);
  return p ? `${WEEKDAYS[p.weekday]}, ${p.day}/${p.month}/${p.year}` : "—";
}

/** "09:00" */
export function formatTime(iso: string): string {
  const p = toParts(iso);
  return p ? `${p.hour}:${p.minute}` : "—";
}
