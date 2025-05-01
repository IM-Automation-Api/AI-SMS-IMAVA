
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import useSWR from "swr";

export interface ConversationWithMessages {
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
}

export function useConversations(leadId?: string) {
  const { user } = useAuth();
  const shouldFetch = !!user && !!leadId;

  const fetcher = async () => {
    if (!shouldFetch) return { conversations: [], total: 0 };

    const { data: conversations, error: conversationsError, count } = await supabase
      .from("conversations")
      .select("*", { count: "exact" })
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (conversationsError) throw conversationsError;

    if (conversations && conversations.length > 0) {
      const conversationsWithMessages: ConversationWithMessages[] = [];

      for (const conversation of conversations) {
        const { data: messages, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversation.id)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;

        // Apply type casting to ensure role is either 'user' or 'assistant'
        const typedMessages = messages?.map(message => ({
          ...message,
          role: message.role === 'user' ? 'user' : 'assistant'
        } as {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          created_at: string;
        })) || [];

        conversationsWithMessages.push({
          ...conversation,
          messages: typedMessages
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

  useEffect(() => {
    if (!shouldFetch) return;

    const channel = supabase
      .channel("conversations-changes")
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "conversations", 
          filter: `lead_id=eq.${leadId}` 
        },
        () => mutate()
      )
      .on(
        "postgres_changes",
        { 
          event: "*", 
          schema: "public", 
          table: "messages" 
        },
        () => mutate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
