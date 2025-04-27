
import { MessageBubble } from "./MessageBubble";

export function MessageList() {
  return (
    <div className="self-stretch px-24 py-8 flex flex-col justify-start items-start gap-6">
      <MessageBubble 
        message="Hello! I'm your personal AI Assistant. How can I help you today?"
        timestamp="02:22 AM"
        isUser={false}
        avatarText="VA"
      />
      <MessageBubble 
        message="Hi! Can you help me with my project?"
        timestamp="02:23 AM"
        isUser={true}
        avatarText="YOU"
      />
    </div>
  );
}
