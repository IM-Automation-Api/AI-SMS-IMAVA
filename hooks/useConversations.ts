import useSWR from 'swr';
import { useAuth } from '../supabase/auth/auth-context';
import { supabase } from '../supabase/supabase';
import { useEffect } from 'react';

type ConversationWithMessages = {
  id: string;
  lead_id: string;
  created_at: string;
  messages: {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
  }[];
};

export function useConversations(leadId?: string) {
  const { user } = useAuth();
  
  // Only fetch if user is authenticated and leadId is provided
  const shouldFetch = !!user && !!leadId;
  
  const fetcher = async () => {
    if (!shouldFetch) return { conversations: [], total: 0 };
    
    // Fetch conversations for the specified lead
    const { data: conversations, error: conversationsError, count } = await supabase
      .from('conversations')
      .select('*', { count: 'exact' })
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
      
    if (conversationsError) throw conversationsError;
    
    // If there are conversations, fetch messages for each conversation
    if (conversations && conversations.length > 0) {
      const conversationsWithMessages: ConversationWithMessages[] = [];
      
      for (const conversation of conversations) {
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true });
          
        if (messagesError) throw messagesError;
        
        conversationsWithMessages.push({
          ...conversation,
          messages: messages || []
        });
      }
      
      return { 
        conversations: conversationsWithMessages, 
        total: count || 0 
      };
    }
    
    return { 
      conversations: [], 
      total: count || 0 
    };
  };
  
  const { data, error, mutate } = useSWR(
    shouldFetch ? `/conversations?leadId=${leadId}` : null,
    fetcher
  );
  
  // Set up real-time subscriptions
  useEffect(() => {
    if (!shouldFetch) return;
    
    const subscription = supabase
      .channel('conversations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: `lead_id=eq.${leadId}` }, () => {
        // Revalidate data when conversations table changes for this lead
        mutate();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        // Revalidate data when messages table changes
        // Ideally, we would filter this by conversation_id, but we'd need to know all conversation IDs
        mutate();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, leadId, mutate]);
  
  return {
    conversations: data?.conversations || [],
    total: data?.total || 0,
    isLoading: shouldFetch && !data && !error,
    isError: error,
    mutate
  };
}
