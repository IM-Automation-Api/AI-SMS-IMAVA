import { useState } from 'react';
import { supabase } from '../supabase/supabase';
import { useLeads } from './useLeads';
import { Lead } from '../supabase/supabase';

export function useLeadActions() {
  const { mutate: mutateLeads } = useLeads();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Add a new lead with optimistic updates
  const addLead = async (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create a temporary optimistic lead
      const optimisticLead = {
        ...leadData,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString()
      } as Lead;
      
      // Update the cache optimistically
      mutateLeads(
        (currentData) => {
          if (!currentData) return { leads: [optimisticLead], total: 1 };
          
          return {
            leads: [optimisticLead, ...currentData.leads],
            total: currentData.total + 1
          };
        },
        false // Don't revalidate yet
      );
      
      // Send the actual request
      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update with the real data
      mutateLeads();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      // If there was an error, revalidate to get the correct data
      mutateLeads();
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update a lead with optimistic updates
  const updateLead = async (id: string, updates: Partial<Lead>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Update the cache optimistically
      mutateLeads(
        (currentData) => {
          if (!currentData) return currentData;
          
          return {
            leads: currentData.leads.map(lead => 
              lead.id === id ? { ...lead, ...updates } : lead
            ),
            total: currentData.total
          };
        },
        false // Don't revalidate yet
      );
      
      // Send the actual request
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update with the real data
      mutateLeads();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      // If there was an error, revalidate to get the correct data
      mutateLeads();
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a lead with optimistic updates
  const deleteLead = async (id: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Update the cache optimistically
      mutateLeads(
        (currentData) => {
          if (!currentData) return currentData;
          
          return {
            leads: currentData.leads.filter(lead => lead.id !== id),
            total: currentData.total - 1
          };
        },
        false // Don't revalidate yet
      );
      
      // Send the actual request
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update with the real data
      mutateLeads();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      // If there was an error, revalidate to get the correct data
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
