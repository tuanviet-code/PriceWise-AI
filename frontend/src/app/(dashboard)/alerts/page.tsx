import { AlertBuilder } from "@/features/alert/components/alert-builder";
import { formatVnd } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/badge";
import { Icons } from "@/shared/ui/icons";
import { PageHeader } from "@/shared/ui/page-header";

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Thông báo giá"
        title="Đừng bỏ lỡ mức giá quan trọng"
        description="PriceWise sẽ giúp bạn theo dõi ngưỡng giá; bạn vẫn là người đưa ra quyết định cuối cùng."
      />
      <section className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <AlertBuilder />
        <article className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Đang theo dõi
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                1 thông báo đang hoạt động
              </p>
            </div>
            <Badge tone="positive">Đang bật</Badge>
          </div>
          <div className="mt-6 rounded-xl border border-line p-5">
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-tint text-gold">
                <Icons.gold className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">Vàng miếng SJC · Mua vào</p>
                <p className="mt-1 text-sm text-ink-soft">
                  Thông báo khi giá thấp hơn hoặc bằng
                </p>
                <p className="mt-4 text-2xl font-semibold tabular-nums">
                  {formatVnd(145_000_000)}
                </p>
                <p className="mt-2 text-xs text-ink-faint">
                  Giá mẫu hiện tại: {formatVnd(146_500_000)}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-6 border-t border-line pt-5 text-xs leading-5 text-pretty text-ink-faint">
            Thông báo phụ thuộc vào tần suất cập nhật và độ sẵn có của nguồn dữ
            liệu. Hãy kiểm tra lại giá tại đơn vị bán trước khi giao dịch.
          </p>
        </article>
      </section>
    </div>
  );
}
