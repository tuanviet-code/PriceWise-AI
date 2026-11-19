"use client";

import { useId, useState } from "react";
import { formatMillions } from "@/shared/lib/format";

export function PriceChart({
  values,
  labels,
  color = "#0b4f3e",
  unit = "triệu đồng/lượng",
}: {
  values: number[];
  labels: string[];
  color?: string;
  unit?: string;
}) {
  const titleId = useId();
  const [activeIndex, setActiveIndex] = useState(values.length - 1);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || 1;
  const width = 720;
  const height = 236;
  const plot = { left: 58, right: 18, top: 18, bottom: 34 };
  const innerWidth = width - plot.left - plot.right;
  const innerHeight = height - plot.top - plot.bottom;
  const x = (index: number) =>
    plot.left + (index / Math.max(values.length - 1, 1)) * innerWidth;
  const y = (value: number) =>
    plot.top + (1 - (value - min) / spread) * innerHeight;
  const points = values
    .map((value, index) => `${x(index)},${y(value)}`)
    .join(" ");
  const activeValue = values[activeIndex];
  const previousValue = values[Math.max(0, activeIndex - 1)];
  const activeChange = activeValue - previousValue;
  const ticks = [max, min + spread / 2, min];

  return (
    <figure aria-labelledby={titleId}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p id={titleId} className="text-xs font-medium text-ink-faint">
            Đơn vị: {unit}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">
            {formatMillions(activeValue)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-faint">{labels[activeIndex]}</p>
          <p
            className={`mt-1 text-sm font-semibold tabular-nums ${activeChange >= 0 ? "text-up" : "text-down"}`}
          >
            {activeIndex === 0
              ? "Điểm đầu kỳ"
              : `${activeChange >= 0 ? "+" : "−"}${formatMillions(Math.abs(activeChange))}`}
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-line bg-surface-muted/40 p-2 sm:p-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-56 w-full overflow-visible"
          role="img"
          onPointerLeave={() => setActiveIndex(values.length - 1)}
        >
          <title>Biểu đồ giá theo thời gian, đơn vị {unit}</title>
          {ticks.map((tick) => {
            const tickY = y(tick);
            return (
              <g key={tick}>
                <line
                  x1={plot.left}
                  y1={tickY}
                  x2={width - plot.right}
                  y2={tickY}
                  stroke="#d5d5c8"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                />
                <text
                  x={plot.left - 10}
                  y={tickY + 6}
                  textAnchor="end"
                  fill="#5f6a63"
                  fontSize="17"
                >
                  {formatMillions(tick)}
                </text>
              </g>
            );
          })}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line
            x1={x(activeIndex)}
            y1={plot.top}
            x2={x(activeIndex)}
            y2={height - plot.bottom}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="3 4"
            opacity=".45"
          />
          {values.map((value, index) => (
            <g
              key={`${labels[index]}-${value}`}
              onPointerEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              role="button"
              tabIndex={0}
              aria-label={`${labels[index]}: ${formatMillions(value)}`}
            >
              <circle cx={x(index)} cy={y(value)} r="13" fill="transparent" />
              <circle
                cx={x(index)}
                cy={y(value)}
                r={activeIndex === index ? 5.5 : 3.5}
                fill={activeIndex === index ? "#fdfdf8" : color}
                stroke={color}
                strokeWidth="3"
              />
            </g>
          ))}
          {labels.map((label, index) => (
            <text
              key={label}
              x={x(index)}
              y={height - 6}
              textAnchor="middle"
              fill="#5f6a63"
              fontSize="17"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-faint">
        <span>
          Cao nhất{" "}
          <strong className="font-semibold tabular-nums text-ink">
            {formatMillions(max)}
          </strong>
        </span>
        <span>
          Thấp nhất{" "}
          <strong className="font-semibold tabular-nums text-ink">
            {formatMillions(min)}
          </strong>
        </span>
        <span>Di chuột hoặc dùng Tab để xem từng mốc</span>
      </figcaption>
      <span className="sr-only">
        {values
          .map((value, index) => `${labels[index]}: ${formatMillions(value)}`)
          .join("; ")}
      </span>
    </figure>
  );
}
