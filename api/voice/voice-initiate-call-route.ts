// /app/api/voice/initiate-call/route.ts

import { NextResponse } from 'next/server';
import { TwilioVoiceService } from '@/lib/services/twilio-voice-service';
import { supabase } from '@/lib/supabase/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, agentId, fromNumber } = body;
    
    if (!leadId || !agentId || !fromNumber) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Get lead information
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();
      
    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Get agent information
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();
      
    if (agentError || !agent) {
      console.error('Error fetching agent:', agentError);
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    // Initiate the call
    const twilioService = new TwilioVoiceService();
    const callSid = await twilioService.initiateCall(
      leadId,
      agentId,
      fromNumber,
      lead.phone
    );
    
    // Log the call in the database
    const { error: insertError } = await supabase.from('voice_calls').insert([
      {
        lead_id: leadId,
        agent_id: agentId,
        call_sid: callSid,
        from_number: fromNumber,
        to_number: lead.phone,
        status: 'initiated',
      }
    ]);
    
    if (insertError) {
      console.error('Error logging call:', insertError);
      return NextResponse.json(
        { error: 'Failed to log call' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      callSid,
      message: `Call initiated to ${lead.first_name} ${lead.last_name} at ${lead.phone}`
    });
  } catch (error) {
    console.error('Error initiating call:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
