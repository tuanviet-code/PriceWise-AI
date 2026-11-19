"use client";

import { useState } from "react";
import { formatNumber, parsePriceInput } from "@/shared/lib/format";
import { Icons } from "@/shared/ui/icons";

export function AlertBuilder() {
  const [asset, setAsset] = useState("Vàng miếng SJC");
  const [target, setTarget] = useState("145.000.000");
  const [saved, setSaved] = useState(false);
  const parsed = parsePriceInput(target);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (parsed !== null) setSaved(true);
  }
  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-7"
    >
      <h2 className="font-display text-2xl font-semibold text-balance">
        Tạo thông báo mới
      </h2>
      <p className="mt-2 text-sm leading-6 text-pretty text-ink-soft">
        Chọn sản phẩm và mức giá bạn muốn theo dõi.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink">
          Sản phẩm
          <select
            value={asset}
            onChange={(e) => {
              setAsset(e.target.value);
              setSaved(false);
            }}
            className="mt-2 block w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm"
          >
            <option>Vàng miếng SJC</option>
            <option>Nhẫn trơn 9999</option>
            <option>Xăng RON 95-III</option>
          </select>
        </label>
        <label className="text-sm font-medium text-ink">
          Mức giá mục tiêu
          <div className="relative mt-2">
            <input
              inputMode="numeric"
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
                setSaved(false);
              }}
              onBlur={() => {
                if (parsed !== null) setTarget(formatNumber(parsed));
              }}
              aria-describedby="target-help"
              className="block w-full rounded-xl border border-line bg-canvas px-4 py-3 pr-12 text-sm tabular-nums"
            />
            <span className="absolute right-4 top-3 text-sm text-ink-faint">
              đ
            </span>
          </div>
          <span
            id="target-help"
            className={`mt-2 block text-xs ${parsed === null ? "text-down" : "text-ink-faint"}`}
          >
            {parsed === null
              ? "Nhập một số tiền hợp lệ."
              : "Bạn có thể dán số có dấu chấm hoặc dấu phẩy."}
          </span>
        </label>
      </div>
      <button
        type="submit"
        disabled={parsed === null}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icons.plus className="size-4" />
        Tạo thông báo
      </button>
      {saved && (
        <p
          role="status"
          className="mt-4 rounded-xl bg-brand-tint p-4 text-sm text-brand"
        >
          Đã tạo bản xem trước cho {asset} ở mức {target} đ. Dữ liệu sẽ được lưu
          khi kết nối backend.
        </p>
      )}
    </form>
  );
}
