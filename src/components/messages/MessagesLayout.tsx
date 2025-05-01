
import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { MessagesSidebar } from './MessagesSidebar';
import { useMessages } from '@/hooks/useMessages';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, ChevronLeft, Loader2, MessageSquare, Plus } from 'lucide-react';
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
    <div className="h-full w-full flex">
      {/* Left sidebar - hidden on mobile when viewing a conversation */}
      {(!isMobile || !conversationId) && (
        <div className={`${isMobile ? 'w-full' : 'w-72'} h-full overflow-hidden ${!isMobile ? 'rounded-l-2xl' : 'rounded-2xl'}`}>
          <MessagesSidebar />
        </div>
      )}
      
      {/* Main content - only shown on desktop or when viewing a conversation on mobile */}
      {(!isMobile || conversationId) && (
        <div className={`flex-1 flex flex-col glass-panel ${isMobile ? 'rounded-2xl' : 'rounded-r-2xl'} overflow-hidden shadow-lg`}>
          <div className="p-4 flex flex-col h-full">
            {isMobile && conversationId && (
              <Button 
                variant="ghost" 
                onClick={handleBackToContacts} 
                className="mb-2 -ml-2 hover:bg-white/10"
                size="sm"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            )}
            
            <Tabs 
              defaultValue="messages" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="flex-1 flex flex-col"
            >
              <TabsList className="bg-black/20 backdrop-blur-md mb-4">
                <TabsTrigger 
                  value="messages" 
                  className="relative data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500/30 data-[state=active]:to-purple-600/30 data-[state=active]:shadow-md"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                  {newMessageCount > 0 && activeTab !== "messages" && (
                    <Badge className="absolute -top-2 -right-2 bg-primary w-5 h-5 flex items-center justify-center p-0 text-xs">
                      {newMessageCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="campaigns" 
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500/30 data-[state=active]:to-purple-600/30 data-[state=active]:shadow-md"
                >
                  Campaigns
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="messages" className="flex-1 flex flex-col h-full overflow-hidden">
                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <MessageList messages={messages} />
                    <MessageInput />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="campaigns">
                <div className="flex flex-col items-center justify-center h-64 glass-panel p-6">
                  <div className="rounded-full bg-purple-500/20 p-4 mb-4">
                    <Plus className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gradient mb-2">Campaigns</h3>
                  <p className="text-muted-foreground text-center mb-4">Create targeted message campaigns to reach your audience</p>
                  <Button className="premium-button" onClick={() => navigate('/campaigns')}> {/* Added onClick handler */}
                    <Plus className="h-4 w-4 mr-2" /> Create Campaign
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
