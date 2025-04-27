
import React from 'react';
import { MessageBubble } from './MessageBubble';

export function MessageList() {
  // In a real app, you would fetch messages from an API
  const messages = [
    {
      id: 1,
      content: "Hello! How can I help you today?",
      type: "bot" as const,
      timestamp: "12:42 PM",
      name: "Assistant"
    },
    {
      id: 2,
      content: "I need help with setting up my agent",
      type: "user" as const,
      timestamp: "12:43 PM",
      status: "read" as const
    },
    {
      id: 3,
      content: "Sure, I can help with that. What specific part are you having trouble with?",
      type: "bot" as const,
      timestamp: "12:44 PM",
      name: "Assistant"
    },
    {
      id: 4,
      content: "I'm not sure how to configure the API credentials",
      type: "user" as const,
      timestamp: "12:45 PM",
      status: "read" as const
    },
    {
      id: 5,
      content: "John is typing...",
      type: "system" as const,
      timestamp: "12:45 PM"
    },
    {
      id: 6,
      content: "To configure API credentials, go to Settings > API and then enter your keys. Would you like me to walk you through it step by step?",
      type: "bot" as const,
      timestamp: "12:46 PM",
      name: "Assistant"
    },
    {
      id: 7,
      content: "Yes, please. That would be helpful.",
      type: "user" as const,
      timestamp: "12:47 PM",
      status: "delivered" as const
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-background flex flex-col">
      <div className="flex-1" /> {/* Spacer to push content to the bottom */}
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          content={message.content}
          type={message.type}
          timestamp={message.timestamp}
          name={message.name}
          status={message.status}
        />
      ))}
    </div>
  );
}
