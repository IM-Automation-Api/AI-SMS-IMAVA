
import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { MessagesSidebar } from './MessagesSidebar';
import { useMessages } from '@/hooks/useMessages';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, ChevronLeft, Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { toast } from '../ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';

export function MessagesLayout() {
  const { messages, newMessageCount, resetNewMessageCount, isLoading } = useMessages(50);
  const [activeTab, setActiveTab] = useState("messages");
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get('id');

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

  // Handle navigation for mobile
  const handleBackToContacts = () => {
    navigate('/messages/contacts');
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex">
      {/* Left sidebar - hidden on mobile when viewing a conversation */}
      {(!isMobile || !conversationId) && (
        <div className={`${isMobile ? 'w-full' : 'w-72'} h-full overflow-hidden ${!isMobile ? 'rounded-l-2xl' : 'rounded-2xl'}`}>
          <MessagesSidebar />
        </div>
      )}
      
      {/* Main content - only shown on desktop or when viewing a conversation on mobile */}
      {(!isMobile || conversationId) && (
        <div className={`flex-1 flex flex-col glass-effect ${isMobile ? 'rounded-2xl' : 'rounded-r-2xl'} overflow-hidden shadow-lg`}>
          <div className="p-6">
            {isMobile && conversationId && (
              <Button 
                variant="ghost" 
                onClick={handleBackToContacts} 
                className="mb-4 -ml-2"
              >
                <ChevronLeft className="mr-1" /> Back
              </Button>
            )}
            
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
      )}
    </div>
  );
}
