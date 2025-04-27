
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailTemplateData {
  [key: string]: string | number | boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, templateName, subject, data } = await req.json();
    
    if (!userId || !templateName || !subject || !data) {
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

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'AI SMS Automation <noreply@aismsautomation.com>',
      to: user.email,
      subject: subject,
      html: generateEmailContent(templateName, {
        ...data,
        subject,
        supportEmail: 'support@aismsautomation.com'
      }),
    });

    console.log('Email sent successfully:', emailResponse);
    
    // Log the notification
    const { error: logError } = await supabase
      .from('notification_logs')
      .insert([{
        user_id: userId,
        type: 'email',
        subject: subject,
        content: JSON.stringify(data),
        status: 'sent'
      }]);
      
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

// Simple template engine function
function generateEmailContent(templateName: string, data: EmailTemplateData): string {
  // You can expand this with more templates as needed
  const templates: Record<string, (data: EmailTemplateData) => string> = {
    welcome: (data) => `
      <h1>Welcome to AI SMS Automation!</h1>
      <p>Hello,</p>
      <p>Thank you for joining us. We're excited to help you automate your SMS communications.</p>
      <p>If you need any help, please contact us at ${data.supportEmail}</p>
    `,
    notification: (data) => `
      <h2>${data.subject}</h2>
      <p>${data.message}</p>
      <hr>
      <p>If you need assistance, contact us at ${data.supportEmail}</p>
    `,
  };

  const template = templates[templateName];
  if (!template) {
    throw new Error(`Template "${templateName}" not found`);
  }

  return template(data);
}
