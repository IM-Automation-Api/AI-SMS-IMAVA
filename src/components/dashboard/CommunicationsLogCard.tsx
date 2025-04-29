import React, { useState, useEffect } from 'react';
import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ThreadSkeleton } from './ThreadSkeleton';
import { ConversationThread, ConversationThreadProps } from './ConversationThread';

export const CommunicationsLogCard = () => {
  const [conversationThreads, setConversationThreads] = useState<ConversationThreadProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newThreadCount, setNewThreadCount] = useState(0);
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Immediately start fetching data
    fetchConversationThreads();

    // Set up real-time subscription for new messages
    const channel = supabase.channel('schema-db-changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'sms_messages'
    }, payload => {
      console.log('New message received:', payload);
      fetchConversationThreads();
      setNewThreadCount(prev => prev + 1);

      // Show toast notification
      toast({
        title: "New message received",
        description: "A new message has arrived in your inbox"
      });
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Function to fetch most recent conversation threads
  const fetchConversationThreads = async () => {
    console.log('Fetching conversation threads...');
    setIsLoading(true);
    try {
      // Get the 5 most recent messages grouped by lead
      const {
        data: messages,
        error
      } = await supabase.from('sms_messages').select('id, lead_id, content, created_at, direction, status').order('created_at', {
        ascending: false
      }).limit(20); // Fetch more to ensure we get enough unique threads

      if (error) {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
        return;
      }
      console.log('Fetched messages:', messages?.length);

      // Process messages to get unique conversation threads
      const threads: Record<string, ConversationThreadProps> = {};
      for (const message of messages || []) {
        // Skip if we already have this lead in our threads
        if (threads[message.lead_id]) continue;

        // Create a new thread entry
        threads[message.lead_id] = {
          id: message.lead_id,
          lead_name: `Lead ${message.lead_id.slice(0, 5)}...`,
          // Simplified name for now
          last_message: message.content,
          timestamp: message.created_at,
          unread: message.direction === 'inbound' && message.status !== 'read'
        };

        // Stop once we have 5 threads
        if (Object.keys(threads).length >= 5) break;
      }
      console.log('Processed threads:', Object.keys(threads).length);
      setConversationThreads(Object.values(threads));

      // Count unread threads
      const unreadCount = Object.values(threads).filter(thread => thread.unread).length;
      setNewThreadCount(unreadCount);
    } catch (err) {
      console.error('Error processing conversation threads:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const resetNewThreadCount = () => setNewThreadCount(0);
  return <Card className="glass-panel shadow-glow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="font-warp text-xl font-medium text-gray-300">
          <MessageCircle className="mr-2 h-5 w-5 text-purple-500" />
          Communications Log
        </CardTitle>
        {newThreadCount > 0 && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/50 hover-glow cursor-pointer" onClick={resetNewThreadCount}>
            {newThreadCount} New {newThreadCount === 1 ? 'Thread' : 'Threads'}
          </Badge>}
      </CardHeader>
      <CardContent>
        {isLoading ? <ThreadSkeleton /> : conversationThreads.length === 0 ? <div className="h-64 flex flex-col items-center justify-center text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
            <p className="text-muted-foreground">No conversation threads yet</p>
          </div> : <div className="space-y-3">
            {conversationThreads.map(thread => <ConversationThread key={thread.id} thread={thread} />)}
          </div>}
      </CardContent>
      <CardFooter className="border-t border-border pt-4">
        <Button className="w-full premium-button">
          View All Messages
        </Button>
      </CardFooter>
    </Card>;
};
