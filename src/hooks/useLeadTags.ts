
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export type LeadTag = {
  id: string;
  name: string;
  color: string;
  client_id: string;
  created_at: string;
}

export function useLeadTags(clientId?: string) {
  const { user } = useAuth();

  const { data: tags, isLoading, error, refetch } = useQuery({
    queryKey: ['lead-tags', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data, error } = await supabase
        .from('lead_tags')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      return data as LeadTag[];
    },
    enabled: !!clientId && !!user
  });

  useEffect(() => {
    if (!clientId || !user) return;

    const channel = supabase
      .channel('lead-tags-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lead_tags' },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId, user, refetch]);

  return {
    tags: tags || [],
    isLoading,
    error
  };
}
