import { createClient } from '@supabase/supabase-js';

// These would typically be environment variables in a production environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export type ApiProvider = 'openai' | 'claude' | 'llama' | 'deepseek' | 'groq';
