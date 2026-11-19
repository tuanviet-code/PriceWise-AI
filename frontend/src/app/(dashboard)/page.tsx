import Link from "next/link";
import { AccessExplorer } from "@/features/landing/components/access-explorer";
import { InteractiveMarketTitle } from "@/features/landing/components/interactive-market-title";
import { MarketMethodStory } from "@/features/landing/components/market-method-story";
import { MarketPlayground } from "@/features/landing/components/market-playground";
import { PageProgress } from "@/features/landing/components/page-progress";
import { Icons } from "@/shared/ui/icons";

export default function LandingPage() {
  return (
    <div className="landing min-h-dvh bg-[#f7f8f4] text-[#202521]">
      <header className="landing-nav fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-[#f7f8f4]/95">
        <div className="wrap mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-brand flex min-h-11 items-center gap-3 rounded-lg text-xl font-semibold tracking-[-0.03em]"
          >
            <span className="grid size-9 place-items-center rounded-full bg-[#0b6047] text-sm text-white">
              P
            </span>
            PriceWise
          </Link>
          <nav
            aria-label="Điều hướng trang giới thiệu"
            className="hidden items-center gap-8 lg:flex"
          >
            <a href="#playground" className="landing-link">
              Dữ liệu trực tiếp
            </a>
            <a href="#access" className="landing-link">
              Quyền truy cập
            </a>
            <a href="#method" className="landing-link">
              Cách hoạt động
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/gold"
              className="hidden min-h-11 items-center px-3 text-sm font-semibold sm:inline-flex"
            >
              Xem giá
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#202521] px-4 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[#0b6047]"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
        <PageProgress />
      </header>

      <main>
        <section
          id="playground"
          className="flex min-h-svh items-center pt-24"
          aria-labelledby="landing-title"
        >
          <div className="wrap mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-12 lg:px-10">
            <div className="lg:col-span-5">
              <p className="font-brand text-sm font-semibold text-[#0b6047]">
                PriceWise cho thị trường Việt Nam
              </p>
              <InteractiveMarketTitle />
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#46544c]">
                Chuyển giữa vàng, xăng dầu và dự đoán ngay trên màn hình. Giá
                trị nào cũng đi cùng nguồn, thời điểm và giới hạn sử dụng.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#playground-demo"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0b6047] px-5 text-sm font-semibold text-white hover:-translate-y-0.5"
                >
                  Thử dữ liệu <Icons.arrow className="size-4" />
                </a>
                <Link
                  href="/gold"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/20 px-5 text-sm font-semibold hover:border-black"
                >
                  Xem toàn bộ giá
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#56615b]">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#24a46d]" />
                  Không cần đăng nhập để xem
                </span>
                <span>Không phải lời khuyên đầu tư</span>
              </div>
            </div>
            <div id="playground-demo" className="lg:col-span-7">
              <MarketPlayground />
            </div>
          </div>
        </section>

        <section
          id="access"
          className="flex min-h-svh items-center bg-[#202521] text-white"
          aria-labelledby="access-title"
        >
          <div className="wrap mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-10">
            <div className="lg:col-span-5">
              <h2
                id="access-title"
                className="font-brand text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl"
              >
                <span className="block">Quyền xem dữ liệu luôn mở.</span>
                <span className="type-outline-light mt-2 block">
                  Cảnh báo và chatbot cần tài khoản.
                </span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-white/90">
                Khách vẫn xem được giá vàng, xăng dầu và dự đoán. Tài khoản chỉ
                cần thiết khi dữ liệu phải được lưu, chủ động gửi cảnh báo hoặc
                trò chuyện với chatbot.
              </p>
              <div className="mt-8 flex gap-5 text-sm">
                <Link
                  href="/today"
                  className="font-semibold text-[#a1ffcb] underline decoration-[#a1ffcb]/40 underline-offset-8"
                >
                  Xem dự đoán
                </Link>
                <Link
                  href="/login"
                  className="font-semibold text-white underline decoration-white/30 underline-offset-8"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
            <div className="lg:col-span-7">
              <AccessExplorer />
            </div>
          </div>
        </section>

        <MarketMethodStory />

        <section
          className="closing-panel relative flex min-h-[72svh] items-center overflow-hidden bg-[#eeeae0]"
          aria-labelledby="closing-title"
        >
          <div className="wrap relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:px-10">
            <div className="lg:col-span-7">
              <h2
                id="closing-title"
                className="font-brand text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl"
              >
                Bắt đầu bằng một <span className="closing-accent">mức giá</span>{" "}
                bạn đang quan tâm.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-lg leading-8 text-[#504c43]">
                Không cần tài khoản để kiểm tra thị trường. Khi muốn PriceWise
                ghi nhớ và chủ động hỗ trợ, hãy đăng nhập.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/gold"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#202521] px-5 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[#393b37]"
                >
                  Xem giá vàng
                </Link>
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#202521]/25 bg-white/30 px-5 text-sm font-semibold text-[#202521] hover:border-[#202521]/60 hover:bg-white/60"
                >
                  Đăng nhập PriceWise
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="overflow-hidden bg-[#111315] text-white">
        <div className="border-b border-white/15 px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <p
            aria-hidden="true"
            className="footer-word font-brand mx-auto max-w-[1500px] select-none text-center text-[clamp(3.7rem,12vw,11rem)] font-semibold leading-[0.9] tracking-[-0.06em]"
          >
            PRICEWISE
          </p>
        </div>

        <div className="wrap mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-12 border-b border-white/15 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
            <div className="lg:col-span-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-lg font-brand text-xl font-semibold"
              >
                <span className="grid size-10 place-items-center rounded-full bg-[#a1ffcb] text-sm font-bold text-[#111315]">
                  P
                </span>
                PriceWise AI
              </Link>
              <p className="mt-6 max-w-sm leading-7 text-white/65">
                Theo dõi giá vàng, xăng dầu và tín hiệu dự đoán với nguồn, thời
                điểm và giới hạn sử dụng rõ ràng.
              </p>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs text-white/65">
                <span className="size-2 rounded-full bg-[#66e7a5]" />
                Dữ liệu thị trường minh họa
              </div>
            </div>

            <nav
              aria-label="Dữ liệu thị trường"
              className="lg:col-span-2 lg:col-start-6"
            >
              <p className="font-brand text-sm font-semibold text-[#a1ffcb]">
                Thị trường
              </p>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                <li>
                  <Link className="footer-link" href="/gold">
                    Giá vàng
                  </Link>
                </li>
                <li>
                  <Link className="footer-link" href="/fuel">
                    Giá xăng dầu
                  </Link>
                </li>
                <li>
                  <Link className="footer-link" href="/today">
                    Dự đoán hôm nay
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Tính năng PriceWise" className="lg:col-span-2">
              <p className="font-brand text-sm font-semibold text-[#a1ffcb]">
                Tài khoản
              </p>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                <li>
                  <Link className="footer-link" href="/login">
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link className="footer-link" href="/alerts">
                    Cảnh báo giá
                  </Link>
                </li>
                <li>
                  <Link className="footer-link" href="/chat">
                    Chatbot hỗ trợ
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="lg:col-span-3">
              <p className="font-brand text-sm font-semibold text-[#a1ffcb]">
                Liên hệ & dự án
              </p>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                <li>
                  <a className="footer-link" href="tel:+84814577495">
                    0814 577 495
                  </a>
                </li>
                <li>
                  <a
                    className="footer-link break-all"
                    href="mailto:tuanviet1520@gmail.com"
                  >
                    tuanviet1520@gmail.com
                  </a>
                </li>
              </ul>
              <a
                href="https://github.com/tuanviet-code/PriceWise-AI"
                target="_blank"
                rel="noreferrer"
                className="footer-link mt-4 inline-flex items-center gap-2 text-sm font-semibold"
              >
                PriceWise-AI trên GitHub
                <Icons.arrow className="size-4 -rotate-45" />
              </a>
              <p className="mt-4 text-sm leading-6 text-white/55">
                Phát triển bởi tuanviet-code. Khám phá mã nguồn và quá trình xây
                dựng sản phẩm.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 PriceWise AI. All rights reserved.</p>
            <p>
              Thông tin chỉ mang tính tham khảo, không phải lời khuyên đầu tư.
            </p>
            <p className="font-medium text-white/70">
              Dữ liệu rõ hơn · Quyết định tự tin hơn
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
