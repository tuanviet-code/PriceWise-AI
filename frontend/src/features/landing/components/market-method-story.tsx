"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icons } from "@/shared/ui/icons";

const steps = [
  {
    id: "price",
    number: "01",
    title: "Giá đi cùng nguồn",
    body: "Mỗi con số giữ nguyên sản phẩm, đơn vị, nơi công bố và thời điểm cập nhật để bạn biết mình đang đọc điều gì.",
  },
  {
    id: "context",
    number: "02",
    title: "Bối cảnh dữ liệu trước kết luận",
    body: "Một nhịp tăng chưa phải xu hướng. PriceWise đặt thay đổi gần nhất cạnh biên độ và giới hạn của dữ liệu.",
  },
  {
    id: "action",
    number: "03",
    title: "Hành động theo quyền truy cập",
    body: "Khách tiếp tục xem tự do. Tài khoản chỉ xuất hiện khi bạn muốn lưu ngưỡng, nhận cảnh báo hoặc hỏi chatbot.",
  },
] as const;

type StepId = (typeof steps)[number]["id"];

function StoryVisual({ active }: { active: StepId }) {
  return (
    <div className="story-visual" data-active={active} aria-live="polite">
      <div className="story-visual-head">
        <span className="font-brand text-sm font-semibold">
          PriceWise / Luồng đọc
        </span>
        <span className="inline-flex items-center gap-2 text-xs text-[#56615b]">
          <span className="size-2 rounded-full bg-[#24a46d]" />
          Dữ liệu minh họa
        </span>
      </div>

      <div className="story-stage">
        <div
          className="story-panel story-panel--price"
          aria-hidden={active !== "price"}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#56615b]">Vàng miếng SJC · Giá bán</p>
              <p className="font-brand mt-3 text-3xl font-semibold tabular-nums sm:text-4xl">
                148.500.000 đ
              </p>
            </div>
            <Icons.gold className="size-7 text-[#756300]" />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10 text-sm">
            <div className="bg-white p-4">
              <p className="text-xs text-[#68736c]">Nguồn</p>
              <p className="mt-2 font-semibold">SJC</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-xs text-[#68736c]">Cập nhật</p>
              <p className="mt-2 font-semibold">09:00 · 18/11/2026</p>
            </div>
          </div>
        </div>

        <div
          className="story-panel story-panel--context"
          aria-hidden={active !== "context"}
        >
          <div className="flex items-center justify-between">
            <p className="font-brand text-xl font-semibold">
              Ba phiên gần nhất
            </p>
            <Icons.calendar className="size-6 text-[#3f5f9a]" />
          </div>
          <div
            className="mt-12 flex items-end justify-between gap-3"
            aria-hidden="true"
          >
            {[38, 52, 47, 68, 74, 86].map((height, index) => (
              <span
                key={height + index}
                className="flex flex-1 flex-col items-center gap-3"
              >
                <span
                  className="w-full rounded-t-md bg-[#3f5f9a]"
                  style={{
                    height: `${height * 1.35}px`,
                    opacity: 0.45 + index * 0.1,
                  }}
                />
                <span className="text-[10px] text-[#68736c]">P{index + 1}</span>
              </span>
            ))}
          </div>
          <p className="mt-7 border-t border-black/10 pt-5 leading-7 text-[#46544c]">
            Giá tăng trong ba phiên, nhưng biên độ và chênh lệch mua–bán vẫn cần
            được đọc cùng nhau.
          </p>
        </div>

        <div
          className="story-panel story-panel--action"
          aria-hidden={active !== "action"}
        >
          <div className="flex items-center justify-between">
            <p className="font-brand text-xl font-semibold">
              Chọn mức chủ động
            </p>
            <Icons.bell className="size-6 text-[#0b6047]" />
          </div>
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-[#edf3ef] px-4 py-4 text-sm">
              <span>Xem thị trường</span>
              <strong className="text-[#0b6047]">Mở cho khách</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-4 text-sm">
              <span>Lưu ngưỡng và nhận cảnh báo</span>
              <strong>Cần tài khoản</strong>
            </div>
          </div>
          <Link
            href="/login?next=/alerts"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#202521] px-4 text-sm font-semibold text-white"
          >
            Đăng nhập để đặt cảnh báo
          </Link>
        </div>
      </div>
    </div>
  );
}

export function MarketMethodStory() {
  const [active, setActive] = useState<StepId>("price");
  const stepRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible)
          setActive(visible.target.getAttribute("data-step") as StepId);
      },
      { rootMargin: "-30% 0px -38%", threshold: [0.15, 0.45, 0.75] },
    );

    stepRefs.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="method"
      className="story-section"
      aria-labelledby="method-title"
    >
      <div className="wrap mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <h2
            id="method-title"
            className="font-brand text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:col-span-5"
          >
            Ba lớp dữ liệu cho một quyết định dễ hiểu hơn.
          </h2>
          <p className="max-w-2xl text-lg leading-8 text-[#46544c] lg:col-span-5 lg:col-start-8">
            Cuộn qua ba lớp PriceWise dùng để giữ dữ liệu tài chính rõ ràng:
            nguồn giá, bối cảnh và hành động phù hợp với quyền của bạn.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            {steps.map((step, index) => (
              <article
                key={step.id}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
                data-step={step.id}
                data-active={active === step.id}
                className="story-step"
                onPointerEnter={() => setActive(step.id)}
              >
                <span className="story-step-number">{step.number}</span>
                <div>
                  <h3 className="font-brand text-2xl font-semibold sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-7 text-[#46544c]">
                    {step.body}
                  </p>
                  <div className="story-mobile-visual mt-7 lg:hidden">
                    <StoryVisual active={step.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-28">
              <StoryVisual active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
