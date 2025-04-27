
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Message = Database['public']['Tables']['sms_messages']['Row'];

export function useMessages(limit = 4) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageCount, setNewMessageCount] = useState(0);

  useEffect(() => {
    // Initial fetch of messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('sms_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (data) {
        setMessages(data);
      }
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
          table: 'sms_messages'
        },
        (payload) => {
          setMessages(prev => [payload.new as Message, ...prev.slice(0, limit - 1)]);
          setNewMessageCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit]);

  const resetNewMessageCount = () => setNewMessageCount(0);

  return { messages, newMessageCount, resetNewMessageCount };
}
