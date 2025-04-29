
import React from 'react';
import { Input } from '@/components/ui/input';
import { BellDot, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

export function MessagesSidebar() {
  return (
    <div className="flex flex-col h-full glass-effect shadow-lg">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="font-semibold text-lg bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">Messages</h2>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hover:scale-110 transition-transform">
          <BellDot className="h-5 w-5 text-indigo-300" />
        </Button>
      </div>
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations" 
            className="pl-9 bg-black/20 border-white/10 focus:border-purple-500/50 focus:ring focus:ring-purple-500/20 transition-all" 
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {/* Sample conversations */}
        <ConversationItem name="Alice Johnson" message="Hey, can you check the latest updates?" time="12:45 PM" active={true} />
        <ConversationItem name="Bob Smith" message="I've sent you the report" time="Yesterday" />
        <ConversationItem name="Carol White" message="Thanks for your help!" time="2d ago" />
        <ConversationItem name="David Brown" message="When is the next meeting?" time="3d ago" />
        <ConversationItem name="Eva Green" message="Please review this ASAP" time="1w ago" />
      </div>
      <div className="p-4 border-t border-white/10">
        <Button 
          variant="outline" 
          className="w-full py-2 border border-white/20 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 hover:scale-105 transition-all duration-300 shadow-md shadow-purple-900/10"
        >
          <MessageSquare className="mr-2 h-4 w-4 text-indigo-300" />
          <span className="text-white/90">New Conversation</span>
        </Button>
      </div>
    </div>
  );
}

interface ConversationItemProps {
  name: string;
  message: string;
  time: string;
  active?: boolean;
}

function ConversationItem({
  name,
  message,
  time,
  active
}: ConversationItemProps) {
  return (
    <div className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all duration-300 mb-1
      ${active 
        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-600/10 shadow-md shadow-purple-900/10 border-l-2 border-indigo-500' 
        : 'hover:bg-white/5 hover:shadow-md hover:translate-x-1'}`}
    >
      <Avatar className="h-10 w-10 border-2 border-white/10 bg-gradient-to-br from-indigo-500/30 to-purple-600/30">
        <span className="text-white font-medium">{name.charAt(0)}</span>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium text-white/90 truncate">{name}</p>
          <span className="text-xs text-white/50 whitespace-nowrap">{time}</span>
        </div>
        <p className="text-sm text-white/70 truncate">{message}</p>
      </div>
    </div>
  );
}
