import { ChatDemo } from "@/features/chat/components/chat-demo";
import { PageHeader } from "@/shared/ui/page-header";

export default function ChatPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tính năng cần đăng nhập"
        title="Hỏi về dữ liệu thị trường"
        description="Đặt câu hỏi bằng ngôn ngữ tự nhiên và nhận câu trả lời có giới hạn rõ ràng."
      />
      <ChatDemo />
    </div>
  );
}
