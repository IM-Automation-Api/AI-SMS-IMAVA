import useSWR from 'swr';
import { useAuth } from '../supabase/auth/auth-context';
import { supabase } from '../supabase/supabase';
import { useEffect } from 'react';

export function useLeads(page = 1, pageSize = 10) {
  const { user } = useAuth();
  
  const fetcher = async () => {
    if (!user) return { leads: [], total: 0 };
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return { 
      leads: data || [], 
      total: count || 0 
    };
  };
  
  const { data, error, mutate } = useSWR(
    user ? `/leads?page=${page}&pageSize=${pageSize}` : null,
    fetcher
  );
  
  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;
    
    const subscription = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        // Revalidate data when leads table changes
        mutate();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, mutate]);
  
  return {
    leads: data?.leads || [],
    total: data?.total || 0,
    isLoading: user && !data && !error,
    isError: error,
    mutate
  };
}
