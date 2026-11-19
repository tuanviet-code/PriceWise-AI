import { marketSample } from "@/features/market-overview/api/market.sample";
import { Badge } from "@/shared/ui/badge";
import { PageHeader } from "@/shared/ui/page-header";

export default function TodayPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Bản tin 18/11/2026"
        title="Điều gì đáng chú ý hôm nay?"
        description="Bản tóm tắt giúp bạn hiểu diễn biến chính mà không cần đọc biểu đồ phức tạp."
      />
      <section className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <article className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <Badge tone="positive">Tóm tắt 2 phút</Badge>
          <h2 className="mt-5 font-display text-3xl font-semibold text-balance">
            Vàng tiếp tục tăng, xăng RON 95 giảm nhẹ
          </h2>
          <p className="mt-4 text-base leading-8 text-pretty text-ink-soft">
            Giá bán vàng miếng SJC trong dữ liệu mẫu đang cao hơn đầu tuần.
            Trong khi đó, giá xăng RON 95-III giảm 190 đồng mỗi lít ở kỳ điều
            chỉnh gần nhất. Hai thị trường có động lực khác nhau và không nên
            được diễn giải thành một tín hiệu đầu tư chung.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gold-tint p-5">
              <p className="text-xs font-semibold uppercase text-warn">Vàng</p>
              <p className="mt-2 text-lg font-semibold">Đà tăng ngắn hạn</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                3 phiên gần nhất tăng, nhưng chênh lệch mua–bán còn rộng.
              </p>
            </div>
            <div className="rounded-xl bg-brand-tint p-5">
              <p className="text-xs font-semibold uppercase text-brand">
                Nhiên liệu
              </p>
              <p className="mt-2 text-lg font-semibold">Giảm trong kỳ mới</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                RON 95-III giảm nhẹ, tác động tiết kiệm trên mỗi lần đổ không
                lớn.
              </p>
            </div>
          </div>
        </article>
        <aside className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-xs font-semibold uppercase text-brand">
            Cách đọc tín hiệu
          </p>
          <ol className="mt-5 space-y-5">
            {[
              "So sánh với kỳ gần nhất, không chỉ nhìn giá hiện tại.",
              "Kiểm tra chênh lệch mua–bán và nguồn dữ liệu.",
              "Đặt ngưỡng theo nhu cầu cá nhân, tránh phản ứng vội.",
            ].map((text, index) => (
              <li key={text} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-pretty text-ink-soft">
                  {text}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-7 border-t border-line pt-5 text-xs leading-5 text-pretty text-ink-faint">
            Phân tích dựa trên dữ liệu minh họa cập nhật{" "}
            {marketSample.updatedAt.slice(0, 10)}. Không phải lời khuyên đầu tư.
          </p>
        </aside>
      </section>
    </div>
  );
}
