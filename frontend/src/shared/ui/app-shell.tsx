"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MAIN_NAV, isActivePath } from "@/shared/config/nav";
import { cn } from "@/shared/lib/cn";
import { Brand } from "./brand";
import { Icons } from "./icons";

const navIcons = [
  Icons.overview,
  Icons.calendar,
  Icons.gold,
  Icons.fuel,
  Icons.bell,
  Icons.info,
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((data: { signedIn: boolean }) => setSignedIn(data.signedIn))
      .catch(() => setSignedIn(false));
  }, []);
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 px-4 py-3 sm:px-6 lg:hidden">
        <div className="flex items-center justify-between">
          <Brand />
          <button
            type="button"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-full border border-line bg-surface"
          >
            {open ? (
              <Icons.close className="size-5" />
            ) : (
              <Icons.menu className="size-5" />
            )}
          </button>
        </div>
        {open && (
          <nav
            aria-label="Điều hướng chính"
            className="mt-3 grid gap-1 border-t border-line pt-3"
          >
            {MAIN_NAV.map((item, index) => {
              const ItemIcon = navIcons[index];
              const locked = item.requiresAuth && signedIn === false;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                    isActivePath(pathname, item.href)
                      ? "bg-brand text-white"
                      : "text-ink-soft",
                  )}
                >
                  <ItemIcon className="size-5" />
                  {item.label}
                  {locked && (
                    <span className="ml-auto text-[10px] font-semibold uppercase">
                      Đăng nhập
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </header>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-line bg-surface px-5 py-7 lg:flex">
        <Brand />
        <nav aria-label="Điều hướng chính" className="mt-10 grid gap-1.5">
          {MAIN_NAV.map((item, index) => {
            const ItemIcon = navIcons[index];
            const locked = item.requiresAuth && signedIn === false;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                  isActivePath(pathname, item.href)
                    ? "bg-brand text-white"
                    : "text-ink-soft hover:bg-surface-muted hover:text-ink",
                )}
              >
                <ItemIcon className="size-5" />
                {item.label}
                {locked && (
                  <span className="ml-auto rounded-full bg-surface-muted px-2 py-1 text-[9px] font-semibold uppercase text-ink-faint">
                    Khóa
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="data-grid overflow-hidden rounded-2xl border border-line bg-brand-tint p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="size-2 rounded-full bg-up" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">
                {signedIn ? "Phiên dùng thử" : "Chế độ khách"}
              </p>
            </div>
            <p className="text-xs leading-5 text-pretty text-ink-soft">
              {signedIn
                ? "Bạn có thể dùng cảnh báo và chatbot dữ liệu."
                : "Bạn có thể xem giá và dự đoán mà không cần đăng nhập."}
            </p>
          </div>
          {signedIn ? (
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="min-h-11 w-full rounded-xl border border-line text-sm font-semibold text-ink-soft hover:bg-surface-muted"
              >
                Đăng xuất
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="flex min-h-11 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white"
            >
              Đăng nhập để mở khóa
            </Link>
          )}
        </div>
      </aside>
      <main className="lg:pl-64">{children}</main>
    </div>
  );
}
