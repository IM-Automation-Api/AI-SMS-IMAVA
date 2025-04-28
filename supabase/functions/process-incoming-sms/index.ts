// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req)  => {
  try {
    // Parse form data from Twilio webhook
    const formData = await req.formData();
    
    // Extract Twilio SMS data
    const messageSid = formData.get('MessageSid') as string;
    const from = formData.get('From') as string;
    const to = formData.get('To') as string;
    const body = formData.get('Body') as string;
    
    if (!messageSid || !from || !to || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Find the lead by phone number
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('id, client_id')
      .eq('phone', from)
      .single();
      
    if (leadError || !leadData) {
      console.error('Error finding lead:', leadError);
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Log the incoming message
    const { error: smsError } = await supabase
      .from('sms_messages')
      .insert([
        {
          lead_id: leadData.id,
          client_id: leadData.client_id,
          direction: 'inbound',
          content: body,
          twilio_message_sid: messageSid,
          status: 'received'
        }
      ]);
      
    if (smsError) {
      console.error('Error logging SMS message:', smsError);
      return new Response(
        JSON.stringify({ error: 'Failed to log message' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Add message to conversation
    const { error: convError } = await supabase
      .from('conversations')
      .insert([
        {
          lead_id: leadData.id,
          role: 'user',
          content: body
        }
      ]);
      
    if (convError) {
      console.error('Error adding to conversation:', convError);
      return new Response(
        JSON.stringify({ error: 'Failed to add to conversation' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Invoke the generate-ai-response function asynchronously
    try {
      await fetch(`${supabaseUrl}/functions/v1/generate-ai-response`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ leadId: leadData.id })
      });
    } catch (error) {
      console.error('Error invoking AI response function:', error);
      // Continue execution even if the AI function invocation fails
    }
    
    // Return TwiML response
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-incoming-sms' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
