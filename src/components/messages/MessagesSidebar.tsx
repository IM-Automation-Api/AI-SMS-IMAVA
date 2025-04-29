
import React from 'react';
import { Input } from '@/components/ui/input';
import { BellDot, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationThread } from '@/components/dashboard/ConversationThread';

// Sample conversation data - in a real app this would come from an API or database
const sampleConversations = [
  {
    id: '1',
    lead_name: 'Alice Johnson',
    last_message: 'Hey, can you check the latest updates?',
    timestamp: new Date().toISOString(),
    unread: true
  },
  {
    id: '2',
    lead_name: 'Bob Smith',
    last_message: 'I've sent you the report',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    unread: false
  },
  {
    id: '3',
    lead_name: 'Carol White',
    last_message: 'Thanks for your help!',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    unread: false
  },
  {
    id: '4',
    lead_name: 'David Brown',
    last_message: 'When is the next meeting?',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    unread: true
  },
  {
    id: '5',
    lead_name: 'Eva Green',
    last_message: 'Please review this ASAP',
    timestamp: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    unread: false
  }
];

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
        {/* Render conversations using ConversationThread component */}
        {sampleConversations.map((conversation) => (
          <ConversationThread key={conversation.id} thread={conversation} />
        ))}
      </div>
    </div>
  );
}
