import React from 'react';
import { BeamsBackground } from '../ui/beams-background';
import { MessagesHeader } from './MessagesHeader';
import { MessagesSidebar } from './MessagesSidebar';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export function MessagesLayout() {
  return (
    <BeamsBackground intensity="subtle">
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl shadow-soft">
        {/* Messages Sidebar */}
        <div className="w-72 border-r border-border bg-card/30 backdrop-blur-sm h-full overflow-auto hidden md:block">
          <MessagesSidebar />
        </div>
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
          <MessagesHeader />
          <MessageList />
          <MessageInput />
        </div>
      </div>
    </BeamsBackground>
  );
}
