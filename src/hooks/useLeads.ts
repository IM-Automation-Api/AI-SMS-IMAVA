
import { useAuth } from "@/lib/supabase/auth/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import useSWR from "swr";

export function useLeads(page = 1, pageSize = 10) {
  const { user } = useAuth();
  const [totalPages, setTotalPages] = useState(1);

  const fetcher = async () => {
    if (!user) return { leads: [], total: 0 };

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("leads")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Calculate total pages
    const total = count || 0;
    const pages = Math.ceil(total / pageSize);
    setTotalPages(pages > 0 ? pages : 1);

    return {
      leads: data || [],
      total: total
    };
  };

  const { data, error, mutate } = useSWR(
    user ? `/leads?page=${page}&pageSize=${pageSize}` : null,
    fetcher
  );

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("leads-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => mutate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, mutate]);

  return {
    leads: data?.leads || [],
    total: data?.total || 0,
    totalPages,
    currentPage: page,
    isLoading: user && !data && !error,
    isError: error,
    mutate
  };
}
