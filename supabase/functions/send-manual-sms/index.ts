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
    const { leadId, message, userId } = await req.json();
    
    if (!leadId || !message || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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
        { status: 404, headers: { 'Content-Type': 'application/json' } }
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
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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
          'Authorization': `Basic ${btoa(`${twilioCredentials.account_sid}:${twilioCredentials.auth_token}`) }`,
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
        { status: 500, headers: { 'Content-Type': 'application/json' } }
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
        { status: 500, headers: { 'Content-Type': 'application/json' } }
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
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: twilioData.sid,
        status: twilioData.status
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

serve(async (req)  => {
  try {
    const { userId, subject, message, eventType } = await req.json();
    
    if (!userId || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get user information
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();
      
    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get notification preferences if eventType is provided
    if (eventType) {
      const { data: preferences, error: prefError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .eq('event_type', eventType)
        .single();
        
      if (!prefError && preferences && !preferences.email_enabled) {
        // User has disabled email notifications for this event type
        return new Response(
          JSON.stringify({ success: false, message: 'Email notifications disabled for this event type' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Configure SMTP client
    const client = new SmtpClient();
    
    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
      port: parseInt(Deno.env.get('SMTP_PORT') || '465'),
      username: Deno.env.get('SMTP_USER') || '',
      password: Deno.env.get('SMTP_PASSWORD') || '',
    });
    
    // Send email
    await client.send({
      from: Deno.env.get('SMTP_FROM') || 'noreply@aismsautomation.com',
      to: user.email,
      subject: subject,
      content: message,
      html: message,
    });
    
    await client.close();
    
    // Log the notification
    const { error: logError } = await supabase
      .from('notification_logs')
      .insert([
        {
          user_id: userId,
          type: 'email',
          subject: subject,
          content: message,
          event_type: eventType || 'manual',
          status: 'sent'
        }
      ]);
      
    if (logError) {
      console.error('Error logging notification:', logError);
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});



/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-manual-sms' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
