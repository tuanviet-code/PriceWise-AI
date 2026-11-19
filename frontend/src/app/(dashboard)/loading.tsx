export default function Loading() {
  return (
    <div className="space-y-7" aria-label="Đang tải nội dung">
      <div className="h-10 w-2/3 rounded-xl bg-surface-muted" />
      <div className="h-5 w-1/2 rounded-lg bg-surface-muted" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-64 rounded-2xl bg-surface-muted" />
        <div className="h-64 rounded-2xl bg-surface-muted" />
      </div>
    </div>
  );
}
