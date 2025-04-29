
import React, { useEffect, useRef } from 'react';
import { MessageBubble, MessageType } from './MessageBubble';
import type { Database } from "@/integrations/supabase/types";

type Message = Database['public']['Tables']['sms_messages']['Row'];

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change, with a small delay
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  // Transform database messages to display format
  const displayMessages = messages.map(message => ({
    id: message.id,
    content: message.content || '',
    type: message.direction === 'inbound' ? 'user' as MessageType : 'bot' as MessageType,
    timestamp: new Date(message.created_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    name: message.direction === 'inbound' ? undefined : "Assistant",
    status: message.status as "sent" | "delivered" | "read" | undefined
  }));

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-background to-background/95 flex flex-col">
      <div className="flex-1" /> {/* Spacer to push content to the bottom */}
      
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <>
          {displayMessages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              type={message.type}
              timestamp={message.timestamp}
              name={message.name}
              status={message.status}
            />
          ))}
        </>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
