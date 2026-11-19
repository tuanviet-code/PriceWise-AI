"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icons } from "@/shared/ui/icons";

type MarketKey = "gold" | "fuel" | "forecast";

const markets = {
  gold: {
    label: "Vàng",
    title: "Vàng miếng SJC",
    value: "148.500.000 đ",
    unit: "đồng/lượng",
    change: "+500.000 đ",
    source: "SJC · 09:00, 18/11/2026",
    color: "#756300",
    values: [143, 144, 143.7, 145.2, 146, 147.6, 148.5],
  },
  fuel: {
    label: "Xăng dầu",
    title: "Xăng RON 95-III",
    value: "20.090 đ/lít",
    unit: "đồng/lít",
    change: "−190 đ/lít",
    source: "Bộ Công Thương · 15:00, 13/11/2026",
    color: "#3f5f9a",
    values: [21.09, 20.79, 20.69, 20.59, 20.28, 20.09, 20.09],
  },
  forecast: {
    label: "Dự đoán",
    title: "Tín hiệu dữ liệu",
    value: "Theo dõi",
    unit: "mức đánh giá",
    change: "Dữ liệu còn biến động",
    source: "Mô hình minh họa · Không phải lời khuyên",
    color: "#0b6047",
    values: [42, 48, 46, 55, 61, 64, 68],
  },
} satisfies Record<
  MarketKey,
  {
    label: string;
    title: string;
    value: string;
    unit: string;
    change: string;
    source: string;
    color: string;
    values: number[];
  }
>;

export function MarketPlayground() {
  const [active, setActive] = useState<MarketKey>("gold");
  const [point, setPoint] = useState(6);
  const market = markets[active];
  const points = useMemo(() => {
    const min = Math.min(...market.values);
    const max = Math.max(...market.values);
    const spread = max - min || 1;
    return market.values.map((value, index) => ({
      x: 24 + index * 82,
      y: 184 - ((value - min) / spread) * 116,
    }));
  }, [market]);

  const changeMarket = (key: MarketKey) => {
    setActive(key);
    setPoint(6);
  };

  useEffect(() => {
    const handleMarketChange = (event: Event) => {
      const key = (event as CustomEvent<MarketKey>).detail;
      if (key in markets) changeMarket(key);
    };

    window.addEventListener("pricewise:market-change", handleMarketChange);
    return () =>
      window.removeEventListener("pricewise:market-change", handleMarketChange);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl bg-[#eaf5ee] p-3 shadow-[0_30px_80px_rgba(6,82,57,.16)] sm:p-5">
      <div className="overflow-hidden rounded-xl bg-white">
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 sm:px-5">
          <div
            className="flex gap-1"
            role="tablist"
            aria-label="Chọn dữ liệu muốn xem"
          >
            {(Object.keys(markets) as MarketKey[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active === key}
                onClick={() => changeMarket(key)}
                className={`min-h-10 rounded-lg px-3 text-xs font-semibold transition ${active === key ? "bg-[#232323] text-white" : "text-[#56615b] hover:bg-[#eef2ef]"}`}
              >
                {markets[key].label}
              </button>
            ))}
          </div>
          <span className="hidden items-center gap-2 text-xs text-[#56615b] sm:flex">
            <span className="size-2 rounded-full bg-[#24a46d]" />
            Dữ liệu minh họa
          </span>
        </div>
        <div className="grid lg:grid-cols-[1fr_190px]">
          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#56615b]">
                  {market.title}
                </p>
                <p className="font-brand mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                  {market.value}
                </p>
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: market.color }}
              >
                {market.change}
              </p>
            </div>
            <div className="relative mt-6 rounded-xl bg-[#f7f8f6] p-2">
              <svg
                viewBox="0 0 540 220"
                className="h-52 w-full"
                role="img"
                aria-label={`Biểu đồ tương tác ${market.title}`}
              >
                {[48, 106, 164].map((y) => (
                  <line
                    key={y}
                    x1="20"
                    x2="520"
                    y1={y}
                    y2={y}
                    stroke="#dfe4df"
                    strokeDasharray="5 6"
                  />
                ))}
                <polyline
                  points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
                  fill="none"
                  stroke={market.color}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points.map(({ x, y }, index) => (
                  <g
                    key={index}
                    onPointerEnter={() => setPoint(index)}
                    onFocus={() => setPoint(index)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Mốc ${index + 1}: ${market.values[index]}`}
                  >
                    <circle cx={x} cy={y} r="14" fill="transparent" />
                    <circle
                      cx={x}
                      cy={y}
                      r={point === index ? 7 : 4}
                      fill={point === index ? "#fff" : market.color}
                      stroke={market.color}
                      strokeWidth="3"
                    />
                  </g>
                ))}
                <line
                  x1={points[point].x}
                  x2={points[point].x}
                  y1="24"
                  y2="190"
                  stroke={market.color}
                  strokeDasharray="4 5"
                  opacity=".45"
                />
              </svg>
              <div className="absolute right-4 top-4 rounded-lg bg-white px-3 py-2 text-right shadow-md">
                <p className="text-[11px] text-[#56615b]">Mốc {point + 1}/7</p>
                <p className="mt-1 text-sm font-semibold tabular-nums">
                  {market.values[point]}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-between gap-3 text-xs text-[#56615b]">
              <span>{market.unit}</span>
              <span>{market.source}</span>
            </div>
          </div>
          <aside className="flex flex-col justify-between bg-[#232323] p-5 text-white">
            <div>
              <p className="text-xs text-white/60">Quyền khách</p>
              <p className="font-brand mt-2 text-xl font-semibold">
                Được xem dữ liệu
              </p>
              <ul className="mt-5 space-y-3 text-sm text-white/75">
                <li className="flex gap-2">
                  <Icons.up className="mt-0.5 size-4" />
                  Giá vàng, xăng dầu
                </li>
                <li className="flex gap-2">
                  <Icons.up className="mt-0.5 size-4" />
                  Dự đoán minh họa
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                type="button"
                disabled
                className="flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/20 text-sm font-semibold text-white/45"
              >
                <Icons.bell className="size-4" />
                Đặt cảnh báo
              </button>
              <Link
                href="/login?next=/alerts"
                className="mt-3 flex min-h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-[#232323] hover:-translate-y-0.5"
              >
                Đăng nhập để mở khóa
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
