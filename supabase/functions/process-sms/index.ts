
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    
    // Extract Twilio SMS data
    const messageSid = formData.get('MessageSid')
    const from = formData.get('From')
    const to = formData.get('To')
    const body = formData.get('Body')
    
    if (!messageSid || !from || !to || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Find the lead by phone number
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('id, client_id')
      .eq('phone', from)
      .single()
      
    if (leadError || !leadData) {
      console.error('Error finding lead:', leadError)
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Log the incoming message
    const { error: smsError } = await supabase
      .from('sms_messages')
      .insert([{
        lead_id: leadData.id,
        client_id: leadData.client_id,
        direction: 'inbound',
        content: body,
        twilio_message_sid: messageSid,
        status: 'received'
      }])
      
    if (smsError) {
      console.error('Error logging SMS message:', smsError)
      return new Response(
        JSON.stringify({ error: 'Failed to log message' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Add message to conversation
    const { error: convError } = await supabase
      .from('conversations')
      .insert([{
        lead_id: leadData.id,
        role: 'user',
        content: body
      }])
      
    if (convError) {
      console.error('Error adding to conversation:', convError)
      return new Response(
        JSON.stringify({ error: 'Failed to add to conversation' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Return TwiML response
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/xml'
        }
      }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
