import { formatSignedVnd, formatVnd } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/badge";
import { PageHeader } from "@/shared/ui/page-header";
import { PriceChart } from "@/shared/ui/price-chart";
import { SectionHeading } from "@/shared/ui/section-heading";

const fuels = [
  { name: "Xăng RON 95-III", price: 20_090, change: -190 },
  { name: "Xăng E5 RON 92-II", price: 19_840, change: -120 },
  { name: "Dầu diesel 0.05S", price: 18_520, change: 150 },
  { name: "Dầu hỏa", price: 18_760, change: 80 },
];

export default function FuelPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Xăng dầu"
        title="Giá bán lẻ nhiên liệu"
        description="Theo dõi kỳ điều chỉnh mới nhất và ước tính mức chi tiêu cho phương tiện cá nhân."
        updatedAt="15:00, 13/11/2026"
      />
      <section>
        <SectionHeading
          title="Mức giá đang áp dụng"
          description="Đơn vị: đồng/lít. Mức thay đổi so với kỳ điều chỉnh trước."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {fuels.map((fuel) => (
            <article
              key={fuel.name}
              className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
            >
              <Badge>
                {fuel.name.includes("RON 95") ? "Phổ biến" : "Toàn quốc"}
              </Badge>
              <h2 className="mt-5 min-h-12 font-semibold text-pretty text-ink">
                {fuel.name}
              </h2>
              <p className="mt-3 text-2xl font-semibold tabular-nums">
                {formatVnd(fuel.price, "đ/lít")}
              </p>
              <p
                className={`mt-4 text-sm font-semibold tabular-nums ${fuel.change < 0 ? "text-down" : "text-up"}`}
              >
                {fuel.change < 0 ? "Giảm " : "Tăng "}
                {formatSignedVnd(Math.abs(fuel.change), "đ/lít")}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
        <article className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
          <Badge tone="positive">RON 95-III</Badge>
          <h2 className="mt-3 font-display text-2xl font-semibold">
            Các kỳ điều chỉnh gần đây
          </h2>
          <div className="mt-6">
            <PriceChart
              values={[21_090, 20_790, 20_690, 20_590, 20_280, 20_090]}
              labels={["04/9", "18/9", "02/10", "16/10", "30/10", "13/11"]}
              color="#3f5f9a"
              unit="đồng/lít"
            />
          </div>
        </article>
        <aside className="rounded-2xl bg-brand p-6 text-white">
          <p className="text-xs font-semibold uppercase text-white/60">
            Ước tính chi phí
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-balance">
            Một bình 40 lít
          </h2>
          <p className="mt-6 text-4xl font-semibold tabular-nums">803.600 đ</p>
          <p className="mt-3 text-sm leading-6 text-pretty text-white/70">
            Tiết kiệm khoảng 7.600 đ so với kỳ trước nếu đổ đầy bình RON 95-III.
          </p>
          <div className="mt-7 border-t border-white/15 pt-5 text-xs leading-5 text-white/60">
            Ước tính chỉ mang tính tham khảo; giá thực tế có thể khác theo khu
            vực và đơn vị bán lẻ.
          </div>
        </aside>
      </section>
    </div>
  );
}
