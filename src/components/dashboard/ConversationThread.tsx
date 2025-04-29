
import React from 'react';
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export interface ConversationThreadProps {
  id: string;
  lead_name: string;
  last_message: string;
  timestamp: string;
  unread: boolean;
}

export const ConversationThread = ({ thread }: { thread: ConversationThreadProps }) => {
  const navigate = useNavigate();

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
            {thread.unread && (
              <span className="h-2.5 w-2.5 bg-primary rounded-full mr-2"></span>
            )}
            <p className={cn(
              "text-sm font-medium",
              thread.unread ? "text-white" : "text-white/80"
            )}>{thread.lead_name}</p>
          </div>
          <span className="text-xs text-white/60">
            {format(new Date(thread.timestamp), 'HH:mm')}
          </span>
        </div>
        <p className={cn(
          "text-sm line-clamp-1",
          thread.unread ? "text-white/90" : "text-white/60"
        )}>{thread.last_message}</p>
      </div>
    </div>
  );
};
