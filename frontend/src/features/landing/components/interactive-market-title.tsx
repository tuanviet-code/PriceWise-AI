"use client";

import { useState } from "react";

type MarketKey = "gold" | "fuel" | "forecast";

const marketWords: Array<{
  key: MarketKey;
  label: string;
  detail: string;
}> = [
  {
    key: "gold",
    label: "vàng",
    detail: "Giá mua, giá bán và nhịp biến động gần nhất.",
  },
  {
    key: "fuel",
    label: "xăng dầu",
    detail: "Kỳ điều chỉnh, mức giá mới và nguồn công bố.",
  },
  {
    key: "forecast",
    label: "dự đoán",
    detail: "Tín hiệu minh họa đi kèm giới hạn sử dụng.",
  },
];

export function InteractiveMarketTitle() {
  const [active, setActive] = useState<MarketKey>("gold");
  const activeIndex = marketWords.findIndex((item) => item.key === active);

  const selectMarket = (key: MarketKey) => {
    setActive(key);
    window.dispatchEvent(
      new CustomEvent("pricewise:market-change", { detail: key }),
    );
  };

  return (
    <div className="mt-5">
      <h1
        id="landing-title"
        className="font-brand max-w-[12ch] text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[4.35rem]"
      >
        <span className="block">Đọc thị trường qua</span>
        <span className="mt-2 flex flex-wrap items-baseline gap-x-[0.22em] gap-y-1">
          {marketWords.map((market, index) => (
            <span key={market.key} className="inline-flex items-baseline">
              <button
                type="button"
                aria-pressed={active === market.key}
                aria-controls="playground-demo"
                onClick={() => selectMarket(market.key)}
                onFocus={() => selectMarket(market.key)}
                onPointerEnter={() => selectMarket(market.key)}
                className="landing-type-control"
              >
                {market.label}
              </button>
              {index < marketWords.length - 1 && (
                <span aria-hidden="true" className="text-[#a99f8d]">
                  ·
                </span>
              )}
            </span>
          ))}
        </span>
      </h1>

      <div
        className="mt-5 flex max-w-lg items-start gap-3 border-l border-[#0b6047]/35 pl-4"
        aria-live="polite"
      >
        <span className="font-brand text-xs font-semibold tracking-[0.16em] text-[#0b6047]">
          0{activeIndex + 1}
        </span>
        <p className="text-sm leading-6 text-[#56615b]">
          {marketWords[activeIndex].detail}
        </p>
      </div>
    </div>
  );
}
