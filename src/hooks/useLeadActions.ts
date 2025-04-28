import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLeads } from "./useLeads";

export function useLeadActions() {
  const { mutate: mutateLeads } = useLeads();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addLead = async (leadData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const optimisticLead = {
        ...leadData,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString()
      };

      mutateLeads(
        (currentData) => {
          if (!currentData) return { leads: [optimisticLead], total: 1 };
          return {
            leads: [optimisticLead, ...currentData.leads],
            total: currentData.total + 1
          };
        },
        false
      );

      const { data, error } = await supabase
        .from("leads")
        .insert(leadData)
        .select()
        .single();

      if (error) throw error;

      mutateLeads();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      mutateLeads();
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateLead = async (id: string, leadData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      mutateLeads(
        (currentData) => {
          if (!currentData) return currentData;
          const updatedLeads = currentData.leads.map((lead) =>
            lead.id === id ? { ...lead, ...leadData } : lead
          );
          return { ...currentData, leads: updatedLeads };
        },
        false
      );

      const { data, error } = await supabase
        .from("leads")
        .update(leadData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      mutateLeads();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      mutateLeads();
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteLead = async (id: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      mutateLeads(
        (currentData) => {
          if (!currentData) return currentData;
          const updatedLeads = currentData.leads.filter((lead) => lead.id !== id);
          return { ...currentData, leads: updatedLeads, total: currentData.total - 1 };
        },
        false
      );

      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id);

      if (error) throw error;

      mutateLeads();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      mutateLeads();
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addLead,
    updateLead,
    deleteLead,
    isSubmitting,
    error
  };
}
