
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
    const { assistantId, leadIds } = await req.json();
    
    if (!assistantId || !leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
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
    
    // Get lead information for all leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('id, first_name, last_name, phone, client_id')
      .in('id', leadIds);
      
    if (leadsError || !leads || leads.length === 0) {
      throw new Error('Failed to fetch leads');
    }
    
    // Structure for storing results
    const results = {
      total: leadIds.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [] as {leadId: string, error: string}[]
    };
    
    // Process each lead
    for (const lead of leads) {
      try {
        results.processed++;
        
        // Get Twilio credentials
        const { data: twilioCredentials, error: twilioError } = await supabase
          .from('twilio_credentials')
          .select('account_sid, auth_token, phone_number')
          .eq('client_id', lead.client_id)
          .eq('is_active', true)
          .single();
          
        if (twilioError || !twilioCredentials) {
          throw new Error(`No active Twilio credentials found for client ${lead.client_id}`);
        }
        
        // Generate message with Groq
        const messages = [
          {
            role: "system",
            content: assistant.system_prompt || `You are a helpful assistant. You're texting ${lead.first_name} ${lead.last_name}. Be friendly and concise.`
          }
        ];

        if (assistant.initial_prompt) {
          messages.push({
            role: "assistant",
            content: assistant.initial_prompt
                .replace("{{first_name}}", lead.first_name || "")
                .replace("{{last_name}}", lead.last_name || "")
                .replace("{{full_name}}", `${lead.first_name || ""} ${lead.last_name || ""}`.trim())
          });
        }

        // Call Groq API
        const groqResponse = await fetch('https://api.groq.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: assistant.groq_model || "mixtral-8x7b-32768",
            messages: messages,
            temperature: assistant.temperature || 0.7,
            max_tokens: assistant.max_tokens || 1000,
          }),
        });

        if (!groqResponse.ok) {
          const error = await groqResponse.json();
          throw new Error(`Failed to get response from Groq: ${JSON.stringify(error)}`);
        }

        const groqData = await groqResponse.json();
        const messageContent = groqData.choices[0].message.content;
        
        // Send SMS via Twilio
        const formData = new URLSearchParams();
        formData.append('To', lead.phone);
        formData.append('From', twilioCredentials.phone_number);
        formData.append('Body', messageContent);

        const twilioResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioCredentials.account_sid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`${twilioCredentials.account_sid}:${twilioCredentials.auth_token}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
          }
        );
        
        if (!twilioResponse.ok) {
          const twilioError = await twilioResponse.json();
          throw new Error(`Failed to send SMS via Twilio: ${JSON.stringify(twilioError)}`);
        }
        
        const twilioData = await twilioResponse.json();
        
        // Log the message in the database
        const { error: smsError } = await supabase
          .from('sms_messages')
          .insert([
            {
              lead_id: lead.id,
              client_id: lead.client_id,
              direction: 'outbound',
              content: messageContent,
              twilio_message_sid: twilioData.sid,
              status: twilioData.status
            }
          ]);
          
        if (smsError) {
          throw new Error(`Failed to log SMS message: ${smsError.message}`);
        }
        
        results.succeeded++;
      } catch (error) {
        console.error(`Error processing lead ${lead.id}:`, error);
        results.failed++;
        results.errors.push({
          leadId: lead.id,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
