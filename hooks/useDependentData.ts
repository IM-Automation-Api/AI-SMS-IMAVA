import useSWR from 'swr';
import { useAuth } from '../supabase/auth/auth-context';
import { supabase } from '../supabase/supabase';
import { useLeads } from './useLeads';
import { useEffect } from 'react';

/**
 * This hook demonstrates dependent data fetching with SWR
 * It first fetches leads, then fetches conversations for the first lead if it exists
 */
export function useDependentData() {
  const { user } = useAuth();
  const { leads, isLoading: isLeadsLoading } = useLeads(1, 1); // Get just the first lead
  
  // Only fetch conversations if user is authenticated and we have at least one lead
  const shouldFetchConversations = !!user && leads.length > 0 && !isLeadsLoading;
  const firstLeadId = leads.length > 0 ? leads[0].id : null;
  
  const conversationsFetcher = async () => {
    if (!shouldFetchConversations || !firstLeadId) return { conversations: [], total: 0 };
    
    const { data: conversations, error, count } = await supabase
      .from('conversations')
      .select('*', { count: 'exact' })
      .eq('lead_id', firstLeadId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { 
      conversations: conversations || [], 
      total: count || 0 
    };
  };
  
  const { 
    data: conversationsData, 
    error: conversationsError, 
    mutate: mutateConversations 
  } = useSWR(
    shouldFetchConversations && firstLeadId ? `/conversations?leadId=${firstLeadId}` : null,
    conversationsFetcher
  );
  
  // Set up real-time subscriptions for conversations
  useEffect(() => {
    if (!shouldFetchConversations || !firstLeadId) return;
    
    const subscription = supabase
      .channel('dependent-data-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'conversations', 
        filter: `lead_id=eq.${firstLeadId}` 
      }, () => {
        mutateConversations();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, firstLeadId, shouldFetchConversations, mutateConversations]);
  
  // Now fetch messages for the first conversation if it exists
  const firstConversation = conversationsData?.conversations?.[0] || null;
  const firstConversationId = firstConversation?.id || null;
  
  const shouldFetchMessages = !!shouldFetchConversations && !!firstConversationId;
  
  const messagesFetcher = async () => {
    if (!shouldFetchMessages || !firstConversationId) return { messages: [], total: 0 };
    
    const { data: messages, error, count } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('conversation_id', firstConversationId)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    return { 
      messages: messages || [], 
      total: count || 0 
    };
  };
  
  const { 
    data: messagesData, 
    error: messagesError, 
    mutate: mutateMessages 
  } = useSWR(
    shouldFetchMessages && firstConversationId ? `/messages?conversationId=${firstConversationId}` : null,
    messagesFetcher
  );
  
  // Set up real-time subscriptions for messages
  useEffect(() => {
    if (!shouldFetchMessages || !firstConversationId) return;
    
    const subscription = supabase
      .channel('dependent-messages-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages', 
        filter: `conversation_id=eq.${firstConversationId}` 
      }, () => {
        mutateMessages();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, firstConversationId, shouldFetchMessages, mutateMessages]);
  
  return {
    lead: leads[0] || null,
    isLeadsLoading,
    
    conversation: firstConversation,
    conversations: conversationsData?.conversations || [],
    isConversationsLoading: shouldFetchConversations && !conversationsData && !conversationsError,
    conversationsError,
    
    messages: messagesData?.messages || [],
    isMessagesLoading: shouldFetchMessages && !messagesData && !messagesError,
    messagesError,
    
    // Function to mutate all data
    mutate: () => {
      mutateConversations();
      mutateMessages();
    }
  };
}
