import Link from "next/link";
import { Icons } from "./icons";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Xem chi tiết",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase text-brand">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold leading-tight tracking-[-0.025em] text-balance text-ink sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-pretty text-ink-soft">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          {linkLabel}
          <Icons.arrow className="size-4" />
        </Link>
      )}
    </div>
  );
}
