import { cn } from "@/shared/lib/cn";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "positive" | "gold" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "positive" && "bg-brand-tint text-brand",
        tone === "gold" && "bg-gold-tint text-warn",
        tone === "warning" && "bg-warn-tint text-warn",
        tone === "neutral" && "bg-surface-muted text-ink-soft",
      )}
    >
      {children}
    </span>
  );
}
