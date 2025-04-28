import useSWR from 'swr';
import { useAuth } from '../supabase/auth/auth-context';
import { supabase } from '../supabase/supabase';
import { supabaseFetcher } from './fetchers';
import { useEffect } from 'react';

export function useStats() {
  const { user } = useAuth();
  
  // Only fetch if user is authenticated
  const shouldFetch = !!user;
  
  const { data: leadCount, error: leadError, mutate: mutateLeads } = 
    useSWR(shouldFetch ? '/leads/count' : null, supabaseFetcher);
    
  const { data: messageCount, error: messageError, mutate: mutateMessages } = 
    useSWR(shouldFetch ? '/conversations/count' : null, supabaseFetcher);
    
  const { data: appointmentCount, error: appointmentError, mutate: mutateAppointments } = 
    useSWR(shouldFetch ? '/appointments/count' : null, supabaseFetcher);
  
  // Function to mutate all data
  const mutate = () => {
    mutateLeads();
    mutateMessages();
    mutateAppointments();
  };
  
  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;
    
    const subscription = supabase
      .channel('table-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        // Revalidate data when table changes
        mutate();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        // Revalidate data when table changes
        mutate();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        // Revalidate data when table changes
        mutate();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, mutate]);
  
  return {
    leadCount: leadCount || 0,
    messageCount: messageCount || 0,
    appointmentCount: appointmentCount || 0,
    isLoading: shouldFetch && (typeof leadCount === 'undefined') && !leadError,
    isError: leadError || messageError || appointmentError,
    mutate
  };
}
