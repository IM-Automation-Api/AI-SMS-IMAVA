
import React, { useEffect, useRef } from 'react';
import { MessageBubble, MessageType } from './MessageBubble';
import type { Database } from "@/integrations/supabase/types";
import { MessageSquare } from 'lucide-react';

type Message = Database['public']['Tables']['sms_messages']['Row'];

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when messages change
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
    status: message.status as "sent" | "delivered" | "read" | undefined,
    unread: message.direction === 'inbound' && message.status !== 'read'
  }));

  // Loading or empty state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6 glass-panel">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          <p className="text-sm text-white/70">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 glass-panel flex flex-col h-full">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
          <div className="rounded-full bg-purple-500/20 p-6 shadow-lg shadow-purple-900/20">
            <MessageSquare className="h-16 w-16 text-white/40" />
          </div>
          <h3 className="text-2xl font-medium text-gradient">No messages yet</h3>
          <p className="text-white/70 text-center max-w-sm">
            Start a new conversation or select an existing one to see your messages here
          </p>
          <button className="premium-button mt-4">
            <MessageSquare className="h-4 w-4 mr-2" /> Start Conversation
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1" /> {/* Spacer to push content to the bottom */}
          {displayMessages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              type={message.type}
              timestamp={message.timestamp}
              name={message.name}
              status={message.status}
              unread={message.unread}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
