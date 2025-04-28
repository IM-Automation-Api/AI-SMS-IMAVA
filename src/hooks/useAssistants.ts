
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import useSWR from "swr";
import { useAuth } from "@/lib/supabase/auth/auth-context";

export interface Assistant {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function useAssistants() {
  const { user } = useAuth();

  const fetcher = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("assistants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
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
