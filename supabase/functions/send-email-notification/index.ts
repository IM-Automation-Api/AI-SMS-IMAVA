// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, subject, message, eventType } = await req.json();
    
    if (!userId || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
