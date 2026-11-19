"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-8 text-center">
      <h1 className="font-display text-3xl font-semibold text-balance">
        Chưa thể tải dữ liệu
      </h1>
      <p className="mt-3 text-sm leading-6 text-pretty text-ink-soft">
        Kết nối có thể đang gián đoạn. Hãy thử tải lại nội dung.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white"
      >
        Thử lại
      </button>
    </div>
  );
}
