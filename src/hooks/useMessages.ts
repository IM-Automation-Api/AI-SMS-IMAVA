
import { useEffect, useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Message = Database['public']['Tables']['sms_messages']['Row'];

export function useMessages(limit = 30, leadId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialFetch, setIsInitialFetch] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      setError(null);
      // Only show loading state on initial fetch to prevent flicker
      if (isInitialFetch) {
        setIsLoading(true);
      }
      
      let query = supabase
        .from('sms_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      // Filter by lead if specified
      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching messages:', fetchError);
        setError(new Error(fetchError.message));
        return;
      }
      
      if (data) {
        // Sort in ascending order for display (oldest first)
        setMessages(data.reverse());
        setIsInitialFetch(false);
      }
    } catch (err) {
      console.error('Exception fetching messages:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching messages'));
    } finally {
      setIsLoading(false);
    }
  }, [limit, leadId, isInitialFetch]);

  useEffect(() => {
    // Initial fetch of messages
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sms_messages',
          ...(leadId ? { filter: `lead_id=eq.${leadId}` } : {})
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
          setNewMessageCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMessages, leadId]);

  const resetNewMessageCount = useCallback(() => setNewMessageCount(0), []);
  
  const refreshMessages = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { 
    messages, 
    newMessageCount, 
    resetNewMessageCount, 
    isLoading, 
    error,
    refreshMessages
  };
}
