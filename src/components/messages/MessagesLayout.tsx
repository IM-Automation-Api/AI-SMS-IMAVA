
import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useMessages } from '@/hooks/useMessages';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell } from 'lucide-react';
import { Badge } from '../ui/badge';

export function MessagesLayout() {
  const { messages, newMessageCount, resetNewMessageCount } = useMessages(50);
  const [activeTab, setActiveTab] = useState("messages");

  useEffect(() => {
    // Reset new message count when the messages tab is active
    if (activeTab === "messages") {
      resetNewMessageCount();
    }
  }, [activeTab, resetNewMessageCount, messages]);

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="p-6">
        <h1 className="text-3xl tracking-[0.12em] font-zag mb-6">Messages</h1>
        
        <Tabs 
          defaultValue="messages" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value="messages" className="relative">
              Messages
              {newMessageCount > 0 && activeTab !== "messages" && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center p-0 text-xs">
                  {newMessageCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications
              <Bell className="ml-2 h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="flex-1 flex flex-col h-[calc(100vh-18rem)]">
            <MessageList messages={messages} />
            <MessageInput />
          </TabsContent>
          
          <TabsContent value="campaigns">
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground">Your campaigns will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground">Your notifications will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
