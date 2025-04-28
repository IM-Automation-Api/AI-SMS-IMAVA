import React from 'react';

export function MessagesLayout() {
  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <h1 className="text-3xl tracking-[0.12em] font-zag">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {/* Messages content will go here */}
          <p>This is where the messages will be displayed.</p>
        </div>
        <div className="p-6 border-t border-border">
          {/* Input and send area will go here */}
          <p>This is where the input and send button will be.</p>
        </div>
      </div>
    </div>
  );
}
