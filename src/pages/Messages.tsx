
import { MessageHeader } from "@/components/messages/MessageHeader";
import { MessageList } from "@/components/messages/MessageList";
import { MessageInput } from "@/components/messages/MessageInput";
import { MessagesLayout } from "@/components/messages/MessagesLayout";
import { MessagesSidebar } from "@/components/messages/MessagesSidebar";

export default function Messages() {
  return (
    <div className="flex h-full">
      <MessagesSidebar />
      <MessagesLayout>
        <MessageHeader />
        <MessageList />
        <MessageInput />
      </MessagesLayout>
    </div>
  );
}
