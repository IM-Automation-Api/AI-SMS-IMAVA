
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import useSWR from "swr";
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { premadeAssistants, PremadeAssistant } from "@/data/premade-assistants";

export interface Assistant {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  isPremade?: boolean;
  groq_model?: string | null;
  initial_prompt?: string | null;
  max_tokens?: number | null;
  system_prompt?: string | null;
  temperature?: number | null;
}

export function useAssistants() {
  const { user } = useAuth();

  const fetcher = async () => {
    if (!user) return [];

    // Fetch user-created assistants from Supabase
    const { data, error } = await supabase
      .from("assistants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Convert premade assistants to match Assistant interface
    const formattedPremadeAssistants = premadeAssistants.map((assistant: PremadeAssistant) => ({
      ...assistant,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user.id,
      isPremade: true
    }));

    // Add isPremade: false to user-created assistants
    const userAssistants = (data || []).map(assistant => ({
      ...assistant,
      isPremade: false
    }));

    // Combine user-created assistants with premade assistants
    return [...formattedPremadeAssistants, ...userAssistants];
  };

  const { data: assistants, error, mutate } = useSWR(
    user ? "assistants" : null,
    fetcher
  );

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("assistants-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assistants" },
        () => mutate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, mutate]);

  return {
    assistants: assistants || [],
    isLoading: !error && !assistants,
    isError: error,
    mutate,
  };
}
