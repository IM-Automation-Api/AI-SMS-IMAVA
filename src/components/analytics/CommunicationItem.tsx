
import React from 'react';
import { Avatar } from '@/components/ui/avatar';

interface CommunicationItemProps {
  sender: string;
  time: string;
  message: string;
  avatar: string;
  unread?: boolean;
}

export function CommunicationItem({ sender, time, message, avatar, unread }: CommunicationItemProps) {
  return (
    <div className="flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-slate-800/50">
      <Avatar className="h-8 w-8">
        <img src={avatar} alt={sender} className="rounded-full" />
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-100">{sender}</p>
          <span className="text-xs text-slate-400">{time}</span>
        </div>
        <p className="text-sm text-slate-300">{message}</p>
      </div>
      {unread && (
        <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
      )}
    </div>
  );
}
