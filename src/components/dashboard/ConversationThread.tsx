
import React from 'react';
import { format } from "date-fns";
import { cn } from '@/lib/utils';

export interface ConversationThreadProps {
  id: string;
  lead_name: string;
  last_message: string;
  timestamp: string;
  unread: boolean;
}

export const ConversationThread = ({ thread }: { thread: ConversationThreadProps }) => (
  <div 
    className="flex items-start space-x-3 p-3 rounded-lg transition-all hover:bg-white/5 hover:scale-[1.02] hover:shadow-md hover:shadow-purple-900/10"
  >
    <div className="relative w-6 flex items-center justify-center mt-1">
      {thread.unread ? (
        <div className="relative">
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-primary rounded-full"></span>
        </div>
      ) : null}
    </div>
    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between">
        <p className={cn(
          "text-sm font-medium",
          thread.unread ? "text-white" : "text-white/80"
        )}>{thread.lead_name}</p>
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
