
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId, message, userId } = await req.json();
    
    if (!leadId || !message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get lead information
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('phone, client_id')
      .eq('id', leadId)
      .single();
      
    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get Twilio credentials
    const { data: twilioCredentials, error: twilioError } = await supabase
      .from('twilio_credentials')
      .select('account_sid, auth_token, phone_number')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();
      
    if (twilioError || !twilioCredentials) {
      console.error('Error fetching Twilio credentials:', twilioError);
      return new Response(
        JSON.stringify({ error: 'No active Twilio credentials found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Send SMS via Twilio
    const formData = new URLSearchParams();
    formData.append('To', lead.phone);
    formData.append('From', twilioCredentials.phone_number);
    formData.append('Body', message);

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
      console.error('Twilio error:', twilioError);
      return new Response(
        JSON.stringify({ error: 'Failed to send SMS via Twilio' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const twilioData = await twilioResponse.json();
    
    // Log the message in the database
    const { error: smsError } = await supabase
      .from('sms_messages')
      .insert([
        {
          lead_id: leadId,
          client_id: lead.client_id,
          direction: 'outbound',
          content: message,
          twilio_message_sid: twilioData.sid,
          status: twilioData.status
        }
      ]);
      
    if (smsError) {
      console.error('Error logging SMS message:', smsError);
      return new Response(
        JSON.stringify({ error: 'Failed to log SMS message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Add message to conversation
    const { error: convError } = await supabase
      .from('conversations')
      .insert([
        {
          lead_id: leadId,
          role: 'assistant',
          content: message
        }
      ]);
      
    if (convError) {
      console.error('Error adding to conversation:', convError);
      return new Response(
        JSON.stringify({ error: 'Failed to add to conversation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: twilioData.sid,
        status: twilioData.status
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
