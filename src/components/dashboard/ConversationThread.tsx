
import React from 'react';
import { format } from "date-fns";
import { Avatar } from "@/components/ui/avatar";

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
    <div className="relative">
      <Avatar className="h-10 w-10">
        <span>{thread.lead_name.charAt(0)}</span>
      </Avatar>
      {thread.unread && (
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full ring-2 ring-background"></span>
      )}
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
