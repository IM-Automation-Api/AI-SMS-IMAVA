
import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { MessagesSidebar } from './MessagesSidebar';
import { useMessages } from '@/hooks/useMessages';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { toast } from '../ui/use-toast';

export function MessagesLayout() {
  const { messages, newMessageCount, resetNewMessageCount, isLoading } = useMessages(50);
  const [activeTab, setActiveTab] = useState("messages");

  useEffect(() => {
    // Reset new message count when the messages tab is active
    if (activeTab === "messages") {
      resetNewMessageCount();
    }
  }, [activeTab, resetNewMessageCount, messages]);

  // Notify on new messages when not on messages tab
  useEffect(() => {
    if (newMessageCount > 0 && activeTab !== "messages") {
      toast({
        title: `${newMessageCount} new message${newMessageCount > 1 ? 's' : ''}`,
        description: "You have unread messages in your inbox",
      });
    }
  }, [newMessageCount, activeTab]);

  return (
    <div className="h-[calc(100vh-10rem)] flex">
      {/* Left sidebar */}
      <div className="w-72 h-full overflow-hidden rounded-l-2xl">
        <MessagesSidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col glass-effect rounded-r-2xl overflow-hidden shadow-lg">
        <div className="p-6">
          <h1 className="text-3xl tracking-[0.12em] font-zag mb-6">Messages</h1>
          
          <Tabs 
            defaultValue="messages" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="mb-4"
          >
            <TabsList className="bg-black/20 backdrop-blur-md">
              <TabsTrigger 
                value="messages" 
                className="relative data-[state=active]:bg-white/10 data-[state=active]:shadow-md"
              >
                Messages
                {newMessageCount > 0 && activeTab !== "messages" && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center p-0 text-xs animate-pulse">
                    {newMessageCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="campaigns" 
                className="data-[state=active]:bg-white/10 data-[state=active]:shadow-md"
              >
                Campaigns
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-white/10 data-[state=active]:shadow-md"
              >
                Notifications
                <Bell className="ml-2 h-4 w-4" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="messages" className="flex-1 flex flex-col h-[calc(100vh-18rem)]">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <MessageList messages={messages} />
              )}
              <MessageInput />
            </TabsContent>
            
            <TabsContent value="campaigns">
              <div className="flex flex-col items-center justify-center h-64 bg-black/10 backdrop-blur-md rounded-2xl p-6">
                <p className="text-muted-foreground">Your campaigns will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="flex flex-col items-center justify-center h-64 bg-black/10 backdrop-blur-md rounded-2xl p-6">
                <p className="text-muted-foreground">Your notifications will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
