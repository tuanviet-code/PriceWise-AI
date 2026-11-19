import Link from "next/link";
import { formatSignedVnd, formatVnd } from "@/shared/lib/format";
import { cn } from "@/shared/lib/cn";
import { Badge } from "@/shared/ui/badge";
import { Icons } from "@/shared/ui/icons";

export function MarketCard({
  type,
  title,
  value,
  secondary,
  change,
  source,
  href,
}: {
  type: "gold" | "fuel";
  title: string;
  value: number;
  secondary?: { label: string; value: number };
  change: number;
  source: string;
  href: string;
}) {
  const AssetIcon = type === "gold" ? Icons.gold : Icons.fuel;
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-sm transition-transform hover:-translate-y-0.5 sm:p-6">
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          type === "gold" ? "bg-gold" : "bg-fuel",
        )}
      />
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "grid size-11 place-items-center rounded-xl",
            type === "gold"
              ? "bg-gold-tint text-gold"
              : "bg-brand-tint text-brand",
          )}
        >
          <AssetIcon className="size-5" />
        </span>
        <Badge>{source}</Badge>
      </div>
      <p className="mt-6 text-sm font-medium text-ink-soft">{title}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-ink">
        {formatVnd(value)}
      </p>
      {secondary && (
        <p className="mt-2 text-sm tabular-nums text-ink-soft">
          {secondary.label}:{" "}
          <strong className="text-ink">{formatVnd(secondary.value)}</strong>
        </p>
      )}
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums",
            change >= 0 ? "text-up" : "text-down",
          )}
        >
          <span aria-hidden="true">{change >= 0 ? "↗" : "↘"}</span>
          {change >= 0 ? "Tăng " : "Giảm "}
          {formatSignedVnd(Math.abs(change))}
        </span>
        <Link
          href={href}
          aria-label={`Xem chi tiết ${title}`}
          className="grid size-10 place-items-center rounded-full border border-line text-brand hover:border-brand hover:bg-brand-tint"
        >
          <Icons.chevron className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
