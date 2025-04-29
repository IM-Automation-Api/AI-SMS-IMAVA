
import React from 'react';
import { format } from "date-fns";
import { MessageCircle } from "lucide-react";

export interface ConversationThreadProps {
  id: string;
  lead_name: string;
  last_message: string;
  timestamp: string;
  unread: boolean;
}

export const ConversationThread = ({ thread }: { thread: ConversationThreadProps }) => (
  <div 
    className="flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-slate-800/50"
  >
    <div className="relative w-6 flex items-center justify-center mt-1">
      {thread.unread ? (
        <div className="relative">
          <MessageCircle className="h-5 w-5 text-primary animate-pulse" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
        </div>
      ) : null}
    </div>
    <div className="flex-1 space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-100">{thread.lead_name}</p>
        <span className="text-xs text-slate-400">
          {format(new Date(thread.timestamp), 'HH:mm')}
        </span>
      </div>
      <p className="text-sm text-slate-300 line-clamp-1">{thread.last_message}</p>
    </div>
  </div>
);
