
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import useSWR from "swr";
import { Json } from "@/integrations/supabase/types";

interface Lead {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string;
  client_id: string;
  created_at: string | null;
  updated_at: string | null;
  last_contacted: string | null;
  notes: string | null;
  tags: Json | null;
}

interface Appointment {
  id: string;
  lead_id: string;
  date: string;
  status: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AppointmentWithLead extends Appointment {
  lead: Lead | null;
}

export function useAppointments(leadId?: string) {
  const { user } = useAuth();
  const shouldFetch = !!user;

  const fetcher = async () => {
    if (!shouldFetch) return { appointments: [], total: 0 };

    let query = supabase
      .from("appointments")
      .select("*", { count: "exact" })
      .order("date", { ascending: true });

    if (leadId) {
      query = query.eq("lead_id", leadId);
    }

    const { data: appointments, error, count } = await query;
    if (error) throw error;

    if (appointments && appointments.length > 0) {
      const appointmentsWithLeads: AppointmentWithLead[] = [];

      for (const appointment of appointments) {
        const { data: lead, error: leadError } = await supabase
          .from("leads")
          .select("*")
          .eq("id", appointment.lead_id)
          .single();

        if (leadError && leadError.code !== "PGRST116") {
          throw leadError;
        }

        appointmentsWithLeads.push({
          ...appointment,
          lead: lead || null,
        });
      }

      return {
        appointments: appointmentsWithLeads,
        total: count || 0,
      };
    }

    return {
      appointments: [],
      total: count || 0,
    };
  };

  const { data, error, mutate } = useSWR(
    shouldFetch ? `/appointments${leadId ? `?leadId=${leadId}` : ""}` : null,
    fetcher
  );

  useEffect(() => {
    if (!shouldFetch) return;

    const channel = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          ...(leadId ? { filter: `lead_id=eq.${leadId}` } : {}),
        },
        () => mutate()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        () => mutate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, leadId, mutate]);

  return {
    appointments: data?.appointments || [],
    total: data?.total || 0,
    isLoading: shouldFetch && !data && !error,
    isError: error,
    mutate,
  };
}

export function useAppointment(appointmentId?: string) {
  const { user } = useAuth();
  const shouldFetch = !!user && !!appointmentId;

  const fetcher = async () => {
    if (!shouldFetch) return null;

    const { data: appointment, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (error) throw error;

    if (appointment) {
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .select("*")
        .eq("id", appointment.lead_id)
        .single();

      if (leadError && leadError.code !== "PGRST116") {
        throw leadError;
      }

      return {
        ...appointment,
        lead: lead || null,
      } as AppointmentWithLead;
    }

    return null;
  };

  const { data, error, mutate } = useSWR(
    shouldFetch ? `/appointment/${appointmentId}` : null,
    fetcher
  );

  useEffect(() => {
    if (!shouldFetch) return;

    const channel = supabase
      .channel("appointment-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `id=eq.${appointmentId}`,
        },
        () => mutate()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
          filter: data?.lead?.id ? `id=eq.${data.lead.id}` : undefined,
        },
        () => mutate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, appointmentId, data?.lead?.id, mutate]);

  return {
    appointment: data,
    isLoading: shouldFetch && !data && !error,
    isError: error,
    mutate,
  };
}
