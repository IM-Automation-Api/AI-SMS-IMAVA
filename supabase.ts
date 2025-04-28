import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase credentials
// If not available, provide clear placeholder values that indicate configuration is needed
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl || 'https://your-project-url.supabase.co',  
  supabaseAnonKey || 'your-anon-key'
);

// Check if Supabase is properly configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anonymous Key is missing. Please set the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  );
}

// Types based on your Supabase schema
export type Client = {
  id: string;
  name: string;
  created_at: string;
};

export type Lead = {
  id: string;
  phone: string;
  first_name?: string;
  client_id: string;
  created_at: string;
};

export type NewLead = {
  id: string;
  phone: string;
  first_name?: string;
  client_id: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  lead_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type Prompt = {
  id: string;
  prompt: string;
  type: 'system' | 'initial';
  client_id: string;
  created_at: string;
};

export type Appointment = {
  id: string;
  lead_id: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
};

export type SupabaseApiKey = {
  id: string;
  user_id: string;
  provider: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
};

export type ApiProvider = 'openai' | 'claude' | 'llama' | 'deepseek' | 'groq';
