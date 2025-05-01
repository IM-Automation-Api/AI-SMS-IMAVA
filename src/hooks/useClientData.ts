import { useAuth } from "@/lib/supabase/auth/auth-context";
import { supabase } from "@/integrations/supabase/client";
import useSWR from "swr";

// Define the expected structure of a user profile record (used as client data)
export interface ClientData {
  id: string; // This is likely the user_id from auth.users
  created_at: string;
  full_name: string;
  onboarding_completed: boolean;
  organization_name: string;
  programming_level: string;
  updated_at: string;
  // Add other relevant fields from user_profiles if needed
}

/**
 * Hook to fetch the client record associated with the currently authenticated user.
 */
export function useClientData() {
  const { user, loading: isAuthLoading } = useAuth(); // Corrected: use 'loading' instead of 'isLoading'

  const fetcher = async (): Promise<ClientData | null> => {
    // Don't fetch if auth is loading or user is not logged in
    if (isAuthLoading || !user) {
      return null;
    }

    const { data, error } = await supabase
      .from('user_profiles') // Changed table name to user_profiles
      .select('*') // Select all fields or specify needed ones like 'id'
      .eq('id', user.id) // Filter by the authenticated user's ID (assuming user_profiles uses 'id' as primary key linked to auth.users.id)
      .maybeSingle(); // Expect at most one matching client record

    if (error) {
      console.error("Error fetching client data:", error);
      throw error; // Re-throw error to be caught by SWR
    }

    return data as ClientData | null;
  };

  // SWR key depends on user ID to re-fetch if user changes
  const swrKey = user ? `client_data_${user.id}` : null;

  const { data: clientData, error, isLoading: isClientLoading } = useSWR<ClientData | null>(
    swrKey,
    fetcher
  );

  return {
    client: clientData,
    clientId: clientData?.id, // Convenience accessor for the ID
    isLoading: isAuthLoading || isClientLoading, // Combined loading state
    isError: error,
  };
}
