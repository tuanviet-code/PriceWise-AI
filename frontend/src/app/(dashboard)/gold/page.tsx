import { marketSample } from "@/features/market-overview/api/market.sample";
import { formatSignedVnd, formatVnd } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/badge";
import { PageHeader } from "@/shared/ui/page-header";
import { PriceChart } from "@/shared/ui/price-chart";
import { SectionHeading } from "@/shared/ui/section-heading";

const products = [
  {
    name: "Vàng miếng SJC",
    buy: 146_500_000,
    sell: 148_500_000,
    change: 500_000,
  },
  {
    name: "Nhẫn trơn 9999",
    buy: 144_600_000,
    sell: 147_100_000,
    change: 300_000,
  },
  {
    name: "Vàng nữ trang 24K",
    buy: 141_900_000,
    sell: 145_400_000,
    change: 200_000,
  },
];

export default function GoldPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Giá vàng"
        title="Theo dõi giá vàng trong nước"
        description="So sánh giá mua, giá bán và biến động lịch sử của các sản phẩm phổ biến."
        updatedAt="09:00, 18/11/2026"
      />
      <section>
        <SectionHeading
          title="Bảng giá hôm nay"
          description="Đơn vị: đồng/lượng. Dữ liệu minh họa theo nguồn SJC."
        />
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[660px] text-left">
              <thead className="bg-surface-muted text-xs uppercase text-ink-faint">
                <tr>
                  <th className="px-5 py-4 font-semibold">Sản phẩm</th>
                  <th className="px-5 py-4 font-semibold">Mua vào</th>
                  <th className="px-5 py-4 font-semibold">Bán ra</th>
                  <th className="px-5 py-4 font-semibold">Thay đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((item, index) => (
                  <tr key={item.name}>
                    <td className="px-5 py-5">
                      <span className="font-semibold text-ink">
                        {item.name}
                      </span>
                      {index === 0 && (
                        <span className="ml-3">
                          <Badge tone="gold">Phổ biến</Badge>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-5 font-medium tabular-nums">
                      {formatVnd(item.buy)}
                    </td>
                    <td className="px-5 py-5 font-semibold tabular-nums">
                      {formatVnd(item.sell)}
                    </td>
                    <td className="px-5 py-5 font-semibold tabular-nums text-up">
                      +{formatSignedVnd(item.change).replace("+", "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <Badge tone="gold">Vàng miếng SJC</Badge>
            <h2 className="mt-3 font-display text-2xl font-semibold">
              Lịch sử giá bán
            </h2>
          </div>
          <div className="flex rounded-lg bg-surface-muted p-1 text-xs font-medium">
            <span className="rounded-md bg-surface px-3 py-2 text-brand shadow-sm">
              7 ngày
            </span>
            <span className="px-3 py-2 text-ink-faint">1 tháng</span>
            <span className="px-3 py-2 text-ink-faint">3 tháng</span>
          </div>
        </div>
        <div className="mt-6">
          <PriceChart
            values={[...marketSample.goldHistory]}
            labels={[...marketSample.labels]}
          />
        </div>
      </section>
      <section className="grid gap-5 md:grid-cols-3">
        {[
          {
            label: "Biên độ 7 ngày",
            value: "5,7 triệu đ",
            note: "Chênh lệch mức cao nhất và thấp nhất",
          },
          {
            label: "Chênh lệch mua–bán",
            value: "2 triệu đ",
            note: "Cần cân nhắc trước giao dịch ngắn hạn",
          },
          {
            label: "Tín hiệu",
            value: "Theo dõi",
            note: "Đà tăng ngắn hạn, biến động còn cao",
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <p className="text-xs font-semibold uppercase text-ink-faint">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-ink">
              {item.value}
            </p>
            <p className="mt-2 text-sm leading-6 text-pretty text-ink-soft">
              {item.note}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
