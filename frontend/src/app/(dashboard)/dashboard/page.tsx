import Link from "next/link";
import { marketSample } from "@/features/market-overview/api/market.sample";
import { MarketCard } from "@/features/market-overview/components/market-card";
import { formatTimeDate } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/badge";
import { Icons } from "@/shared/ui/icons";
import { PageHeader } from "@/shared/ui/page-header";
import { PriceChart } from "@/shared/ui/price-chart";
import { SectionHeading } from "@/shared/ui/section-heading";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Thị trường Việt Nam"
        title="Tổng quan thị trường"
        description="Nắm bắt giá vàng và xăng dầu mới nhất, hiểu biến động trước khi đưa ra quyết định."
        updatedAt={formatTimeDate(marketSample.updatedAt)}
      />
      <section aria-labelledby="market-now">
        <SectionHeading
          eyebrow="Giá mới nhất"
          title="Thị trường hôm nay"
          description="Mức thay đổi được so với kỳ cập nhật liền trước."
        />
        <div id="market-now" className="mt-5 grid gap-4 md:grid-cols-2">
          <MarketCard
            type="gold"
            title="Vàng miếng SJC · Giá bán"
            value={marketSample.gold.sell}
            secondary={{ label: "Mua vào", value: marketSample.gold.buy }}
            change={marketSample.gold.change}
            source={marketSample.gold.source}
            href="/gold"
          />
          <MarketCard
            type="fuel"
            title={marketSample.fuel.name}
            value={marketSample.fuel.price}
            change={marketSample.fuel.change}
            source={marketSample.fuel.source}
            href="/fuel"
          />
        </div>
      </section>
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,.75fr)]">
        <article className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-7">
          <Badge tone="gold">Vàng SJC</Badge>
          <h2 className="mt-3 font-display text-2xl font-semibold">
            Biến động 7 ngày
          </h2>
          <div className="mt-6">
            <PriceChart
              values={[...marketSample.goldHistory]}
              labels={[...marketSample.labels]}
            />
          </div>
        </article>
        <aside className="rounded-2xl bg-brand p-6 text-white">
          <Badge tone="gold">Góc nhìn dữ liệu</Badge>
          <h2 className="mt-5 font-display text-2xl font-semibold">
            Đà tăng đang chiếm ưu thế
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/90">
            Giá bán SJC tăng trong 3 phiên gần nhất. Chênh lệch mua–bán vẫn ở
            mức cao.
          </p>
          <Link
            href="/today"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold"
          >
            Đọc phân tích hôm nay <Icons.arrow className="size-4" />
          </Link>
        </aside>
      </section>
    </div>
  );
}
