
import React, { useEffect, useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { StatsCard } from "@/components/analytics/StatsCard";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { CircleDot, TrendingUp, MessageSquare, Users, GaugeCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationThread {
  id: string;
  lead_name: string;
  last_message: string;
  timestamp: string;
  unread: boolean;
}

// Memoized components to prevent unnecessary re-renders
const MemoizedStatsCard = memo(StatsCard);

// Loading skeleton for communication threads
const ThreadSkeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-start space-x-3 p-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    ))}
  </div>
);

export default function Dashboard() {
  const [conversationThreads, setConversationThreads] = useState<ConversationThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newThreadCount, setNewThreadCount] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    // Immediately start fetching data
    fetchConversationThreads();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sms_messages',
        },
        (payload) => {
          console.log('New message received:', payload);
          fetchConversationThreads();
          setNewThreadCount(prev => prev + 1);
          
          // Show toast notification
          toast({
            title: "New message received",
            description: "A new message has arrived in your inbox",
          });
        }
      )
      .subscribe();
      
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
      const { data: messages, error } = await supabase
        .from('sms_messages')
        .select('id, lead_id, content, created_at, direction, status')
        .order('created_at', { ascending: false })
        .limit(20); // Fetch more to ensure we get enough unique threads
      
      if (error) {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
        return;
      }
      
      console.log('Fetched messages:', messages?.length);
      
      // Process messages to get unique conversation threads
      const threads: Record<string, ConversationThread> = {};
      
      for (const message of messages || []) {
        // Skip if we already have this lead in our threads
        if (threads[message.lead_id]) continue;
        
        // Create a new thread entry
        threads[message.lead_id] = {
          id: message.lead_id,
          lead_name: `Lead ${message.lead_id.slice(0, 5)}...`, // Simplified name for now
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
  
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-3xl tracking-[0.12em] font-zag">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MemoizedStatsCard title="Total Messages" value="54,231" icon={<MessageSquare className="h-4 w-4" />} trend="up" trendValue="12%" />
        <MemoizedStatsCard title="Active Users" value="2,431" icon={<Users className="h-4 w-4" />} trend="up" trendValue="8%" />
        <MemoizedStatsCard title="Success Rate" value="95%" icon={<TrendingUp className="h-4 w-4" />} trend="up" trendValue="2%" />
        <MemoizedStatsCard title="Avg. Response Time" value="1.2s" icon={<GaugeCircle className="h-4 w-4" />} trend="down" trendValue="3%" />
      </div>

      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-foreground flex items-center text-base">
            <MessageSquare className="mr-2 h-5 w-5 text-primary" />
            Communications Log
          </CardTitle>
          {newThreadCount > 0 && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/50"
                  onClick={resetNewThreadCount}>
              {newThreadCount} New {newThreadCount === 1 ? 'Thread' : 'Threads'}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ThreadSkeleton />
          ) : conversationThreads.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
              <p className="text-muted-foreground">No conversation threads yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversationThreads.map((thread) => (
                <div key={thread.id} 
                     className="flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-slate-800/50">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <span>{thread.lead_name.charAt(0)}</span>
                    </Avatar>
                    {thread.unread && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full ring-2 ring-background"></span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-100">{thread.lead_name}</p>
                      <span className="text-xs text-slate-400">
                        {format(new Date(thread.timestamp), 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 line-clamp-1">{thread.last_message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-border pt-4">
          <Button variant="outline" className="w-full text-primary hover:bg-primary/10 hover:text-primary">
            View All Messages
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Continue with other analytics cards... */}
        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-xl shadow-card hover:shadow-hover transition-shadow md:col-span-2">
          <CardHeader>
            <CardTitle>User Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-full">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-muted stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                  <circle className="text-primary stroke-current" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="25.12" fill="transparent" r="40" cx="50" cy="50" />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary">
                  90%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card/50 backdrop-blur-sm rounded-xl shadow-card hover:shadow-hover transition-shadow">
          <CardHeader>
            <CardTitle>Conversation Length</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">0-2 min</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">45%</Badge>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">2-5 min</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">30%</Badge>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{width: '30%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">5+ min</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">25%</Badge>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
