
import React from 'react';
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { ConversationWithMessages } from '@/hooks/useConversations'; // Import the interface

export interface ConversationThreadProps {
  id: string;
  lead_id: string;
  created_at: string;
  messages: {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
  }[];
}

export const ConversationThread = ({ thread }: { thread: ConversationThreadProps }) => {
  const navigate = useNavigate();

  const lastMessage = thread.messages[thread.messages.length - 1];
  // Note: Unread status logic is not available in the current data structure
  // Lead name is also not directly available, using lead_id as placeholder

  const handleClick = () => {
    navigate(`/messages?id=${thread.id}`);
  };

  return (
    <div 
      className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-white/5 menu-item cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Removed unread indicator */}
            <p className={cn(
              "text-sm font-medium",
              "text-white" // Assuming always read for now
            )}>{`Lead ID: ${thread.lead_id}`}</p> {/* Using lead_id as placeholder */}
          </div>
          <span className="text-xs text-white/60">
            {format(new Date(thread.created_at), 'HH:mm')} {/* Using created_at */}
          </span>
        </div>
        <p className={cn(
          "text-sm line-clamp-1",
          "text-white/90" // Assuming always read for now
        )}>{lastMessage?.content || 'No messages yet'}</p> {/* Displaying last message content */}
      </div>
    </div>
  );
};
