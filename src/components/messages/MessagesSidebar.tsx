
import React from 'react';
import { Input } from '@/components/ui/input';
import { BellDot, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

export function MessagesSidebar() {
  return (
    <div className="flex flex-col h-full glass-panel">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-xl font-warp text-gradient">Messages</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hover:scale-110 transition-all">
            <Plus className="h-5 w-5 text-white" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hover:scale-110 transition-all">
            <BellDot className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations" 
            className="pl-9 premium-input" 
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {/* Sample conversations */}
        <ConversationItem name="Alice Johnson" message="Hey, can you check the latest updates?" time="12:45 PM" active={true} unread={true} />
        <ConversationItem name="Bob Smith" message="I've sent you the report" time="Yesterday" />
        <ConversationItem name="Carol White" message="Thanks for your help!" time="2d ago" />
        <ConversationItem name="David Brown" message="When is the next meeting?" time="3d ago" unread={true} />
        <ConversationItem name="Eva Green" message="Please review this ASAP" time="1w ago" />
      </div>
    </div>
  );
}

interface ConversationItemProps {
  name: string;
  message: string;
  time: string;
  active?: boolean;
  unread?: boolean;
}

function ConversationItem({
  name,
  message,
  time,
  active = false,
  unread = false
}: ConversationItemProps) {
  return (
    <div className={`flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all duration-300 mb-1
      ${active 
        ? 'bg-gradient-to-br from-indigo-500/20 to-purple-600/10 shadow-md shadow-purple-900/10' 
        : 'hover:bg-white/5 hover:shadow-md hover:translate-x-1'}`}
    >
      <div className="relative">
        <Avatar className={`h-10 w-10 border ${unread ? 'border-primary' : 'border-white/10'} bg-gradient-to-br from-indigo-500/30 to-purple-600/30`}>
          <span className="text-white font-medium">{name.charAt(0)}</span>
        </Avatar>
        {unread && <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-primary rounded-full ring-2 ring-black"></span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className={`${unread ? 'font-semibold' : 'font-medium'} text-white/90 truncate`}>{name}</p>
          <span className="text-xs text-white/50 whitespace-nowrap">{time}</span>
        </div>
        <p className={`text-sm ${unread ? 'text-white/90' : 'text-white/70'} truncate`}>{message}</p>
      </div>
    </div>
  );
}
