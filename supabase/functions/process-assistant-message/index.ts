
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assistantId, message } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get assistant configuration
    const { data: assistant, error: assistantError } = await supabase
      .from('assistants')
      .select('*')
      .eq('id', assistantId)
      .single();
      
    if (assistantError || !assistant) {
      throw new Error('Assistant not found');
    }

    const messages = [
      {
        role: "system",
        content: assistant.system_prompt || "You are a helpful AI assistant."
      }
    ];

    if (assistant.initial_prompt) {
      messages.push({
        role: "assistant",
        content: assistant.initial_prompt
      });
    }

    messages.push({
      role: "user",
      content: message
    });

    // Call Groq API
    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: assistant.groq_model || "mixtral-8x7b-32768",
        messages: messages,
        temperature: assistant.temperature || 0.7,
        max_tokens: assistant.max_tokens || 32768,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API error:', error);
      throw new Error('Failed to get response from Groq');
    }

    const groqResponse = await response.json();
    const aiMessage = groqResponse.choices[0].message.content;

    return new Response(
      JSON.stringify({ message: aiMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
