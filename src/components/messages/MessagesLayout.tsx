
import React from 'react';
import { MessagesHeader } from './MessagesHeader';
import { MessagesSidebar } from './MessagesSidebar';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export function MessagesLayout() {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Messages Sidebar */}
      <div className="w-64 border-r border-border bg-card h-full overflow-auto hidden md:block">
        <MessagesSidebar />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <MessagesHeader />
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
}
