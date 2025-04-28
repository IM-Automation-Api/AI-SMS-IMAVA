import useSWR from 'swr';
import { useAuth } from '../supabase/auth/auth-context';
import { supabase } from '../supabase/supabase';
import { useEffect } from 'react';
import { Appointment, Lead } from '../supabase/supabase';

type AppointmentWithLead = Appointment & {
  lead: Lead | null;
};

export function useAppointments(leadId?: string) {
  const { user } = useAuth();
  
  // Only fetch if user is authenticated
  const shouldFetch = !!user;
  
  const fetcher = async () => {
    if (!shouldFetch) return { appointments: [], total: 0 };
    
    let query = supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .order('scheduled_time', { ascending: true });
      
    // If leadId is provided, filter by lead_id
    if (leadId) {
      query = query.eq('lead_id', leadId);
    }
    
    const { data: appointments, error, count } = await query;
      
    if (error) throw error;
    
    // If there are appointments, fetch lead data for each appointment
    if (appointments && appointments.length > 0) {
      const appointmentsWithLeads: AppointmentWithLead[] = [];
      
      for (const appointment of appointments) {
        const { data: lead, error: leadError } = await supabase
          .from('leads')
          .select('*')
          .eq('id', appointment.lead_id)
          .single();
          
        if (leadError && leadError.code !== 'PGRST116') {
          // PGRST116 is the error code when no rows are returned
          throw leadError;
        }
        
        appointmentsWithLeads.push({
          ...appointment,
          lead: lead || null
        });
      }
      
      return { 
        appointments: appointmentsWithLeads, 
        total: count || 0 
      };
    }
    
    return { 
      appointments: [], 
      total: count || 0 
    };
  };
  
  const { data, error, mutate } = useSWR(
    shouldFetch ? `/appointments${leadId ? `?leadId=${leadId}` : ''}` : null,
    fetcher
  );
  
  // Set up real-time subscriptions
  useEffect(() => {
    if (!shouldFetch) return;
    
    let channel = supabase.channel('appointments-changes');
    
    // If leadId is provided, filter by lead_id
    if (leadId) {
      channel = channel.on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments', 
          filter: `lead_id=eq.${leadId}` 
        }, 
        () => mutate()
      );
    } else {
      channel = channel.on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'appointments' 
        }, 
        () => mutate()
      );
    }
    
    // Also listen for changes to leads table as it affects our joined data
    channel = channel.on(
      'postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'leads' 
      }, 
      () => mutate()
    );
    
    const subscription = channel.subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, leadId, mutate]);
  
  return {
    appointments: data?.appointments || [],
    total: data?.total || 0,
    isLoading: shouldFetch && !data && !error,
    isError: error,
    mutate
  };
}

// Hook for a single appointment with lead data
export function useAppointment(appointmentId?: string) {
  const { user } = useAuth();
  
  // Only fetch if user is authenticated and appointmentId is provided
  const shouldFetch = !!user && !!appointmentId;
  
  const fetcher = async () => {
    if (!shouldFetch) return null;
    
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();
      
    if (error) throw error;
    
    if (appointment) {
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', appointment.lead_id)
        .single();
        
      if (leadError && leadError.code !== 'PGRST116') {
        throw leadError;
      }
      
      return {
        ...appointment,
        lead: lead || null
      } as AppointmentWithLead;
    }
    
    return null;
  };
  
  const { data, error, mutate } = useSWR(
    shouldFetch ? `/appointment/${appointmentId}` : null,
    fetcher
  );
  
  // Set up real-time subscriptions
  useEffect(() => {
    if (!shouldFetch) return;
    
    const subscription = supabase
      .channel('appointment-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'appointments', 
        filter: `id=eq.${appointmentId}` 
      }, () => {
        mutate();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'leads', 
        filter: `id=eq.${data?.lead_id}` 
      }, () => {
        mutate();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, appointmentId, data?.lead_id, mutate]);
  
  return {
    appointment: data,
    isLoading: shouldFetch && !data && !error,
    isError: error,
    mutate
  };
}
