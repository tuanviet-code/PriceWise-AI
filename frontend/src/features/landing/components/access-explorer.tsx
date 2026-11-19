"use client";

import { useState } from "react";
import Link from "next/link";
import { Icons } from "@/shared/ui/icons";

const permissions = [
  { icon: Icons.gold, label: "Giá vàng", guest: true, user: true },
  { icon: Icons.fuel, label: "Giá xăng dầu", guest: true, user: true },
  { icon: Icons.calendar, label: "Dự đoán", guest: true, user: true },
  { icon: Icons.bell, label: "Thông báo giá", guest: false, user: true },
  { icon: Icons.info, label: "Chatbot dữ liệu", guest: false, user: true },
] as const;

export function AccessExplorer() {
  const [mode, setMode] = useState<"guest" | "user">("guest");
  return (
    <div className="grid overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(0,0,0,.14)] lg:grid-cols-[260px_1fr]">
      <div className="bg-[#0b6047] p-6 text-white">
        <p className="font-brand text-2xl font-semibold">
          Thử hai chế độ truy cập
        </p>
        <p className="mt-3 text-sm leading-6 text-white/75">
          Chuyển vai trò để thấy chính xác tính năng nào được mở.
        </p>
        <div className="mt-7 grid gap-2">
          <button
            type="button"
            onClick={() => setMode("guest")}
            aria-pressed={mode === "guest"}
            className={`min-h-12 rounded-xl px-4 text-left text-sm font-semibold ${mode === "guest" ? "bg-white text-[#0b6047]" : "bg-white/10 text-white"}`}
          >
            Không đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setMode("user")}
            aria-pressed={mode === "user"}
            className={`min-h-12 rounded-xl px-4 text-left text-sm font-semibold ${mode === "user" ? "bg-[#a1ffcb] text-[#232323]" : "bg-white/10 text-white"}`}
          >
            Đã đăng nhập
          </button>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#56615b]">Đang xem quyền</p>
            <h3 className="font-brand mt-1 text-2xl font-semibold">
              {mode === "guest" ? "Khách truy cập" : "Người dùng PriceWise"}
            </h3>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${mode === "guest" ? "bg-[#eef2ef] text-[#56615b]" : "bg-[#d9ffe9] text-[#0b6047]"}`}
          >
            {mode === "guest" ? "3/5 tính năng" : "5/5 tính năng"}
          </span>
        </div>
        <div className="mt-7 divide-y divide-black/10 border-y border-black/10">
          {permissions.map(({ icon: Icon, label, guest, user }) => {
            const allowed = mode === "guest" ? guest : user;
            return (
              <div
                key={label}
                className="flex min-h-16 items-center justify-between gap-4"
              >
                <span className="flex items-center gap-3 font-medium">
                  <Icon className="size-5 text-[#0b6047]" />
                  {label}
                </span>
                <span
                  className={`text-sm font-semibold ${allowed ? "text-[#0b6047]" : "text-[#9a3c22]"}`}
                >
                  {allowed ? "Có thể dùng" : "Cần đăng nhập"}
                </span>
              </div>
            );
          })}
        </div>
        {mode === "guest" ? (
          <Link
            href="/login"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#232323] px-5 text-sm font-semibold text-white"
          >
            Đăng nhập để mở đủ tính năng
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b6047] px-5 text-sm font-semibold text-white"
          >
            Mở trang tổng quan
          </Link>
        )}
      </div>
    </div>
  );
}
