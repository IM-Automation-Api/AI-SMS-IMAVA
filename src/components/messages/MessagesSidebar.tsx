
import React from 'react';
import { Input } from '@/components/ui/input';
import { BellDot, Plus, Search, Loader2 } from 'lucide-react'; // Added Loader2
import { Button } from '@/components/ui/button';
import { ConversationThread } from '@/components/dashboard/ConversationThread';
import { useConversations } from '@/hooks/useConversations'; // Import the hook

export function MessagesSidebar() {
  const { conversations, isLoading, isError } = useConversations(); // Use the hook

  if (isLoading) {
    return (
      <div className="flex flex-col h-full glass-panel items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">Loading conversations...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full glass-panel items-center justify-center text-red-500">
        Error loading conversations.
      </div>
    );
  }

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
        {conversations && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <ConversationThread key={conversation.id} thread={conversation} />
          ))
        ) : (
          <div className="text-center text-muted-foreground mt-8">
            No conversations found.
          </div>
        )}
      </div>
    </div>
  );
}
