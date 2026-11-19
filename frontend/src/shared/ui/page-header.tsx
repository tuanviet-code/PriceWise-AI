import { Badge } from "./badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  updatedAt,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  updatedAt?: string;
}) {
  return (
    <header className="flex flex-col justify-between gap-5 border-b border-line pb-7 md:flex-row md:items-end">
      <div>
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-brand">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl font-semibold leading-[1.12] tracking-[-0.035em] text-balance text-ink md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-pretty text-ink-soft">
          {description}
        </p>
      </div>
      {updatedAt && (
        <div className="shrink-0">
          <Badge tone="positive">Cập nhật {updatedAt}</Badge>
        </div>
      )}
    </header>
  );
}
