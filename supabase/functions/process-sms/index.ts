
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { AIService } from './services/ai-service.ts';
import { TwilioService } from './services/twilio-service.ts';

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
    const { leadId, messageId } = await req.json();
    
    if (!leadId) {
      return new Response(
        JSON.stringify({ error: 'Missing leadId parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*, clients(id, user_id)')
      .eq('id', leadId)
      .single();
      
    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: history } = await supabase
      .from('conversations')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });
      
    const { data: systemPrompt } = await supabase
      .from('prompts')
      .select('prompt')
      .eq('client_id', lead.client_id)
      .eq('type', 'system')
      .single();
      
    const { data: preference } = await supabase
      .from('user_preferences')
      .select('preferred_ai_provider')
      .eq('user_id', lead.clients.user_id)
      .single();
      
    const preferredProvider = preference?.preferred_ai_provider || 'openai';
    
    const { data: apiKey, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('provider, api_key')
      .eq('user_id', lead.clients.user_id)
      .eq('provider', preferredProvider)
      .eq('is_active', true)
      .single();
      
    if (apiKeyError || !apiKey) {
      console.error('Error fetching API key:', apiKeyError);
      return new Response(
        JSON.stringify({ error: 'No active API key found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { data: twilioCredentials, error: twilioError } = await supabase
      .from('twilio_credentials')
      .select('account_sid, auth_token, phone_number')
      .eq('user_id', lead.clients.user_id)
      .eq('is_active', true)
      .single();
      
    if (twilioError || !twilioCredentials) {
      console.error('Error fetching Twilio credentials:', twilioError);
      return new Response(
        JSON.stringify({ error: 'No active Twilio credentials found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const aiService = new AIService(apiKey.provider, apiKey.api_key);
    const aiResponse = await aiService.generateResponse(
      systemPrompt?.prompt || 'You are a helpful assistant',
      history || []
    );
    
    if (!aiResponse.success) {
      console.error('Error generating AI response:', aiResponse.error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { error: saveError } = await supabase
      .from('conversations')
      .insert([{
        lead_id: leadId,
        role: 'assistant',
        content: aiResponse.message
      }]);
      
    if (saveError) {
      console.error('Error saving AI response:', saveError);
      return new Response(
        JSON.stringify({ error: 'Failed to save AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const twilioService = new TwilioService(
      twilioCredentials.account_sid,
      twilioCredentials.auth_token,
      twilioCredentials.phone_number
    );
    
    const smsResult = await twilioService.sendSMS(
      lead.phone,
      aiResponse.message || ''
    );
    
    if (!smsResult.success) {
      console.error('Error sending SMS:', smsResult.error);
      return new Response(
        JSON.stringify({ error: 'Failed to send SMS' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { error: logError } = await supabase
      .from('sms_messages')
      .insert([{
        lead_id: leadId,
        client_id: lead.client_id,
        direction: 'outbound',
        content: aiResponse.message,
        twilio_message_sid: smsResult.messageSid,
        status: 'sent'
      }]);
      
    if (logError) {
      console.error('Error logging SMS message:', logError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: aiResponse.message,
        messageSid: smsResult.messageSid
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
