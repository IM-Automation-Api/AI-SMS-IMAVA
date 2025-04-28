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

// Simple AI service for edge function
class AIService {
  private provider: string;
  private apiKey: string;

  constructor(provider: string, apiKey: string)  {
    this.provider = provider;
    this.apiKey = apiKey;
  }

  async generateResponse(systemPrompt: string, conversation: any[]): Promise<{ success: boolean; message?: string; error?: any }> {
    try {
      // Format conversation history
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversation.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      // Generate response based on provider
      switch (this.provider) {
        case 'openai':
          return await this.generateOpenAIResponse(messages);
        case 'claude':
          return await this.generateClaudeResponse(messages);
        // Add other providers as needed
        default:
          return { success: false, error: `Unsupported AI provider: ${this.provider}` };
      }
    } catch (error) {
      console.error(`Error generating AI response with ${this.provider}:`, error);
      return { success: false, error };
    }
  }

  private async generateOpenAIResponse(messages: any[]): Promise<{ success: boolean; message?: string; error?: any }> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          temperature: 0.7,
          max_tokens: 500
        }) 
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error };
      }

      const data = await response.json();
      const message = data.choices[0]?.message?.content?.trim();
      return message ? { success: true, message } : { success: false, error: 'No response generated' };
    } catch (error) {
      return { success: false, error };
    }
  }

  private async generateClaudeResponse(messages: any[]): Promise<{ success: boolean; message?: string; error?: any }> {
    try {
      // Extract system prompt
      const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
      const conversationMessages = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          system: systemPrompt,
          messages: conversationMessages,
          max_tokens: 500
        }) 
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error };
      }

      const data = await response.json();
      const message = data.content[0]?.text?.trim();
      return message ? { success: true, message } : { success: false, error: 'No response generated' };
    } catch (error) {
      return { success: false, error };
    }
  }
}

// Simple Twilio service for edge function
class TwilioService {
  private accountSid: string;
  private authToken: string;
  private phoneNumber: string;

  constructor(accountSid: string, authToken: string, phoneNumber: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.phoneNumber = phoneNumber;
  }

  async sendSMS(to: string, body: string): Promise<{ success: boolean; messageSid?: string; error?: any }> {
    try {
      const formData = new URLSearchParams();
      formData.append('To', to);
      formData.append('From', this.phoneNumber);
      formData.append('Body', body);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`) }`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error };
      }

      const data = await response.json();
      return { success: true, messageSid: data.sid };
    } catch (error) {
      return { success: false, error };
    }
  }
}

serve(async (req) => {
  try {
    const { leadId } = await req.json();
    
    if (!leadId) {
      return new Response(
        JSON.stringify({ error: 'Missing leadId parameter' }),
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
      .select('*, clients(id, user_id)')
      .eq('id', leadId)
      .single();
      
    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get conversation history
    const { data: history, error: historyError } = await supabase
      .from('conversations')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: true });
      
    if (historyError) {
      console.error('Error fetching conversation history:', historyError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch conversation history' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get system prompt
    const { data: systemPrompt, error: promptError } = await supabase
      .from('prompts')
      .select('prompt')
      .eq('client_id', lead.client_id)
      .eq('type', 'system')
      .single();
      
    if (promptError && promptError.code !== 'PGRST116') {
      console.error('Error fetching system prompt:', promptError);
    }
    
    // Get user preferences
    const { data: preference, error: preferenceError } = await supabase
      .from('user_preferences')
      .select('preferred_ai_provider')
      .eq('user_id', lead.clients.user_id)
      .single();
      
    const preferredProvider = preference?.preferred_ai_provider || 'openai';
    
    // Get active API key for the user
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
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get Twilio credentials
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
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize AI service
    const aiService = new AIService(apiKey.provider, apiKey.api_key);
    
    // Generate AI response
    const aiResponse = await aiService.generateResponse(
      systemPrompt?.prompt || 'You are a helpful assistant',
      history || []
    );
    
    if (!aiResponse.success) {
      console.error('Error generating AI response:', aiResponse.error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate AI response' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Save AI response to conversation
    const { error: saveError } = await supabase
      .from('conversations')
      .insert([
        {
          lead_id: leadId,
          role: 'assistant',
          content: aiResponse.message
        }
      ]);
      
    if (saveError) {
      console.error('Error saving AI response:', saveError);
      return new Response(
        JSON.stringify({ error: 'Failed to save AI response' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Send SMS with AI response
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
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Log the outbound message
    const { error: logError } = await supabase
      .from('sms_messages')
      .insert([
        {
          lead_id: leadId,
          client_id: lead.client_id,
          direction: 'outbound',
          content: aiResponse.message,
          twilio_message_sid: smsResult.messageSid,
          status: 'sent'
        }
      ]);
      
    if (logError) {
      console.error('Error logging SMS message:', logError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: aiResponse.message,
        messageSid: smsResult.messageSid
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

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-ai-response' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
