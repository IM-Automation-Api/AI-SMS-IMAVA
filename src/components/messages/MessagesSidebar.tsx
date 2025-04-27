import React from 'react';
import { Input } from '@/components/ui/input';
import { BellDot, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

export function MessagesSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-lg rainbow-text-gradient">Messages</h2>
        <Button variant="ghost" size="icon" className="rounded-full">
          <BellDot className="h-5 w-5" />
        </Button>
      </div>
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search conversations" className="pl-8 bg-background" />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {/* Sample conversations */}
        <ConversationItem name="Alice Johnson" message="Hey, can you check the latest updates?" time="12:45 PM" active={true} />
        <ConversationItem name="Bob Smith" message="I've sent you the report" time="Yesterday" />
        <ConversationItem name="Carol White" message="Thanks for your help!" time="2d ago" />
        <ConversationItem name="David Brown" message="When is the next meeting?" time="3d ago" />
        <ConversationItem name="Eva Green" message="Please review this ASAP" time="1w ago" />
      </div>
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="rainbow-border-gradient w-full py-[2px] rounded px-[25px] font-light">
          <MessageSquare className="mr-2 h-4 w-4" />
          New Conversation
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
  return <div className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent rounded-md transition-colors ${active ? 'bg-accent' : ''}`}>
      <Avatar className="h-10 w-10">
        <span>{name.charAt(0)}</span>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">{name}</p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{message}</p>
      </div>
    </div>;
}
