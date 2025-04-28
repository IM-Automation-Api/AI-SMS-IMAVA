
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Message = Database['public']['Tables']['sms_messages']['Row'];

export function useMessages(limit = 30, leadId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of messages
    const fetchMessages = async () => {
      setIsLoading(true);
      
      let query = supabase
        .from('sms_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      // Filter by lead if specified
      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching messages:', error);
      }
      
      if (data) {
        // Sort in ascending order for display (oldest first)
        setMessages(data.reverse());
      }
      
      setIsLoading(false);
    };

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
  }, [limit, leadId]);

  const resetNewMessageCount = () => setNewMessageCount(0);

  return { messages, newMessageCount, resetNewMessageCount, isLoading };
}
