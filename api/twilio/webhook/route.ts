import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract Twilio SMS data
    const messageSid = formData.get('MessageSid') as string;
    const from = formData.get('From') as string;
    const to = formData.get('To') as string;
    const body = formData.get('Body') as string;
    
    if (!messageSid || !from || !to || !body) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Find the lead by phone number
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('id, client_id')
      .eq('phone', from)
      .single();
      
    if (leadError || !leadData) {
      console.error('Error finding lead:', leadError);
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
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
      return NextResponse.json(
        { error: 'Failed to log message' },
        { status: 500 }
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
      return NextResponse.json(
        { error: 'Failed to add to conversation' },
        { status: 500 }
      );
    }
    
    // Return TwiML response
    return new NextResponse(
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
