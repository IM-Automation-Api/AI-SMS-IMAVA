import { supabase } from '../supabase/supabase';

export const supabaseFetcher = async (url: string) => {
  // Parse the URL to determine what data to fetch
  if (url.startsWith('/leads/count')) {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
      
    if (error) throw error;
    return count || 0;
  }
  
  if (url.startsWith('/conversations/count')) {
    const { count, error } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true });
      
    if (error) throw error;
    return count || 0;
  }
  
  if (url.startsWith('/appointments/count')) {
    const { count, error } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });
      
    if (error) throw error;
    return count || 0;
  }
  
  // Default case - throw error for unhandled routes
  throw new Error(`Unhandled route: ${url}`);
};
