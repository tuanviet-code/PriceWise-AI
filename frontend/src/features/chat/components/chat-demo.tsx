"use client";

import { FormEvent, useState } from "react";

type Message = { role: "user" | "assistant"; text: string };

export function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Bạn có thể hỏi về dữ liệu mẫu đang hiển thị. Tôi sẽ luôn nêu nguồn và giới hạn của câu trả lời.",
    },
  ]);
  const [value, setValue] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const question = value.trim();
    if (!question) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: question },
      {
        role: "assistant",
        text: "Trong dữ liệu minh họa, giá bán SJC tăng trong 3 phiên gần nhất. Tuy nhiên chênh lệch mua–bán còn cao và đây không phải dự báo lợi nhuận hay lời khuyên đầu tư.",
      },
    ]);
    setValue("");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
      <div className="border-b border-line px-5 py-4">
        <h2 className="font-display text-xl font-semibold">
          Trợ lý dữ liệu PriceWise
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Phản hồi mẫu, chưa kết nối mô hình AI.
        </p>
      </div>
      <div className="min-h-[360px] space-y-4 p-5" aria-live="polite">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[82%] rounded-xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "ml-auto bg-brand text-white" : "bg-brand-tint text-ink"}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-3 border-t border-line p-4">
        <label htmlFor="chat-question" className="sr-only">
          Câu hỏi
        </label>
        <input
          id="chat-question"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Hỏi về biến động giá..."
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-line bg-white px-4 outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="min-h-11 rounded-xl bg-brand px-5 text-sm font-semibold text-white"
        >
          Gửi câu hỏi
        </button>
      </form>
    </div>
  );
}
