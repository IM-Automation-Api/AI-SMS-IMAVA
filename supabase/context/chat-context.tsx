"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase, Lead, Message, Conversation } from "../../../lib/supabase";
import { useAuth } from "@/lib/auth-context";

type ChatContextType = {
  leads: Lead[];
  conversations: Conversation[];
  messages: { [leadId: string]: Message[] };
  loading: boolean;
  loadingMessages: boolean;
  sendMessage: (leadId: string, content: string) => Promise<void>;
  getMessages: (leadId: string) => Promise<Message[]>;
  loadMoreMessages: (leadId: string, from: number) => Promise<Message[]>;
  createLead: (lead: Omit<Lead, "id" | "user_id" | "created_at" | "updated_at">) => Promise<Lead | null>;
  updateLeadStatus: (leadId: string, status: Lead["status"]) => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [leadId: string]: Message[] }>({});
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Load leads and conversations when user is authenticated
  useEffect(() => {
    if (!user) {
      setLeads([]);
      setConversations([]);
      setMessages({});
      setLoading(false);
      return;
    }

    const fetchLeadsAndConversations = async () => {
      setLoading(true);

      // Fetch leads
      const { data: leadsData, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (leadsError) {
        console.error("Error fetching leads:", leadsError);
      } else if (leadsData) {
        setLeads(leadsData as Lead[]);

        // Fetch conversations
        const { data: conversationsData, error: conversationsError } = await supabase
          .from("conversations")
          .select("*")
          .in(
            "lead_id",
            leadsData.map((lead) => lead.id)
          )
          .order("updated_at", { ascending: false });

        if (conversationsError) {
          console.error("Error fetching conversations:", conversationsError);
        } else if (conversationsData) {
          setConversations(conversationsData as Conversation[]);
        }
      }

      setLoading(false);
    };

    fetchLeadsAndConversations();

    // Subscribe to changes in leads table
    const leadsSubscription = supabase
      .channel("leads-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setLeads((prev) => [payload.new as Lead, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setLeads((prev) =>
              prev.map((lead) =>
                lead.id === payload.new.id ? (payload.new as Lead) : lead
              )
            );
          } else if (payload.eventType === "DELETE") {
            setLeads((prev) => prev.filter((lead) => lead.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Subscribe to changes in conversations table
    const conversationsSubscription = supabase
      .channel("conversations-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        (payload) => {
          // Check if the conversation belongs to one of the user's leads
          const leadIds = leads.map((lead) => lead.id);
          if (
            (payload.new && leadIds.includes(payload.new.lead_id)) ||
            (payload.old && leadIds.includes(payload.old.lead_id))
          ) {
            if (payload.eventType === "INSERT") {
              setConversations((prev) => [payload.new as Conversation, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setConversations((prev) =>
                prev.map((conv) =>
                  conv.id === payload.new.id ? (payload.new as Conversation) : conv
                )
              );
            } else if (payload.eventType === "DELETE") {
              setConversations((prev) =>
                prev.filter((conv) => conv.id !== payload.old.id)
              );
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsSubscription);
      supabase.removeChannel(conversationsSubscription);
    };
  }, [user]);

  // Function to get messages for a specific lead
  const getMessages = async (leadId: string): Promise<Message[]> => {
    setLoadingMessages(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching messages:", error);
      setLoadingMessages(false);
      return [];
    }

    const messagesData = data as Message[];

    // Store messages in state
    setMessages((prev) => ({
      ...prev,
      [leadId]: messagesData.reverse(),
    }));

    // Subscribe to new messages for this lead
    const messagesSubscription = supabase
      .channel(`messages-${leadId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `lead_id=eq.${leadId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => ({
              ...prev,
              [leadId]: [...(prev[leadId] || []), payload.new as Message],
            }));
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) => ({
              ...prev,
              [leadId]: (prev[leadId] || []).map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              ),
            }));
          }
        }
      )
      .subscribe();

    setLoadingMessages(false);
    return messagesData.reverse();
  };

  // Function to load more messages
  const loadMoreMessages = async (leadId: string, from: number): Promise<Message[]> => {
    setLoadingMessages(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .range(from, from + 19);

    if (error) {
      console.error("Error fetching more messages:", error);
      setLoadingMessages(false);
      return [];
    }

    const messagesData = data as Message[];

    // Add older messages to the beginning of the array
    setMessages((prev) => ({
      ...prev,
      [leadId]: [...messagesData.reverse(), ...(prev[leadId] || [])],
    }));

    setLoadingMessages(false);
    return messagesData.reverse();
  };

  // Function to send a message
  const sendMessage = async (leadId: string, content: string) => {
    if (!user) return;

    // Optimistically add message to state
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      lead_id: leadId,
      content,
      sender: "user",
      status: "sending",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [leadId]: [...(prev[leadId] || []), optimisticMessage],
    }));

    // Send message to API
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          lead_id: leadId,
          content,
          sender: "user",
          status: "sent",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);

      // Update optimistic message with error status
      setMessages((prev) => ({
        ...prev,
        [leadId]: (prev[leadId] || []).map((msg) =>
          msg.id === optimisticMessage.id
            ? { ...msg, status: "error" }
            : msg
        ),
      }));

      return;
    }

    // Update conversation last message
    await supabase
      .from("conversations")
      .update({
        last_message: content,
        last_message_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("lead_id", leadId);

    // Remove optimistic message (it will be added by the subscription)
    setMessages((prev) => ({
      ...prev,
      [leadId]: (prev[leadId] || []).filter(
        (msg) => msg.id !== optimisticMessage.id
      ),
    }));
  };

  // Function to create a new lead
  const createLead = async (
    lead: Omit<Lead, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<Lead | null> => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          ...lead,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      return null;
    }

    // Create conversation for the lead
    await supabase
      .from("conversations")
      .insert([
        {
          lead_id: data.id,
          unread_count: 0,
        },
      ]);

    return data as Lead;
  };

  // Function to update lead status
  const updateLeadStatus = async (leadId: string, status: Lead["status"]) => {
    const { error } = await supabase
      .from("leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", leadId);

    if (error) {
      console.error("Error updating lead status:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        leads,
        conversations,
        messages,
        loading,
        loadingMessages,
        sendMessage,
        getMessages,
        loadMoreMessages,
        createLead,
        updateLeadStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
}
