import Link from "next/link";
import { Brand } from "@/shared/ui/brand";

export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="grid min-h-svh bg-white lg:grid-cols-2">
      <section className="flex flex-col px-5 py-6 sm:px-10 lg:px-16 lg:py-10">
        <Brand />
        <div className="my-auto w-full max-w-md py-16">
          <h1 className="landing-display text-4xl leading-tight sm:text-5xl">
            Đăng nhập để theo dõi mức giá của bạn.
          </h1>
          <p className="mt-4 leading-7 text-[#565656]">
            Truy cập tổng quan thị trường, lịch sử giá và cảnh báo đã lưu.
          </p>
          <form
            action="/api/auth/login"
            method="post"
            className="mt-9 space-y-5"
          >
            <input
              type="hidden"
              name="next"
              value={params.next ?? "/dashboard"}
            />
            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                minLength={6}
                autoComplete="email"
                placeholder="ban@example.com"
                className="mt-2 min-h-12 w-full rounded-xl border border-black/20 px-4 outline-none focus:border-[#0b6047] focus:ring-2 focus:ring-[#0b6047]/20"
              />
            </div>
            <div>
              <div className="flex justify-between gap-4">
                <label htmlFor="password" className="text-sm font-semibold">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  disabled
                  className="text-sm text-[#686868]"
                >
                  Quên mật khẩu
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                className="mt-2 min-h-12 w-full rounded-xl border border-black/20 px-4 outline-none focus:border-[#0b6047] focus:ring-2 focus:ring-[#0b6047]/20"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#232323] px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-[#0b6047]"
            >
              Đăng nhập bản dùng thử
            </button>
          </form>
          {params.error === "invalid" && (
            <p role="alert" className="mt-4 text-sm font-medium text-down">
              Email phải hợp lệ và mật khẩu cần ít nhất 6 ký tự.
            </p>
          )}
          <p className="mt-5 rounded-xl bg-[#eff8f2] p-4 text-sm leading-6 text-[#42534a]">
            Giao diện này chưa kết nối dịch vụ xác thực. Email và mật khẩu hợp
            lệ về định dạng sẽ mở dashboard dùng thử.
          </p>
          <p className="mt-6 text-sm text-[#565656]">
            Đăng ký sẽ được mở khi backend xác thực sẵn sàng.
          </p>
        </div>
        <Link href="/" className="text-sm font-semibold text-[#0b6047]">
          ← Quay lại trang giới thiệu
        </Link>
      </section>
      <section className="hidden bg-[#232323] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <p className="max-w-md text-lg leading-8 text-white/70">
          Theo dõi giá không cần biến bạn thành một nhà giao dịch. PriceWise giữ
          thông tin gọn, có nguồn và dễ kiểm tra.
        </p>
        <div>
          <p className="landing-display max-w-xl text-6xl leading-[1.02]">
            Một mức giá chỉ có ý nghĩa khi đi cùng bối cảnh.
          </p>
          <div className="mt-10 h-2 w-32 rounded-full bg-[#a1ffcb]" />
        </div>
        <p className="text-sm text-white/50">PriceWise AI · Dữ liệu minh họa</p>
      </section>
    </main>
  );
}
