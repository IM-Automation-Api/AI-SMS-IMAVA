// /app/api/voice/connect/route.ts

import { NextResponse } from 'next/server';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { supabase } from '@/lib/supabase/supabase';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const agentId = searchParams.get('agentId');
    
    if (!leadId || !agentId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Get agent configuration
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
    
    // Create TwiML response
    const twiml = new VoiceResponse();
    
    // Start a stream to process audio in real-time
    twiml.start().stream({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/stream?leadId=${leadId}&agentId=${agentId}`,
      track: 'inbound_track',
    });
    
    // Get the greeting message from the agent configuration or use a default
    const greeting = agent.voice_greeting || 
      `Hello, this is ${agent.name} calling on behalf of AI SMS Automation. How are you today?`;
    
    // Have the AI agent introduce itself
    twiml.say(
      { voice: agent.voice_name || 'Polly.Joanna' },
      greeting
    );
    
    // Gather user input
    twiml.gather({
      input: 'speech' as any,
      action: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/respond?leadId=${leadId}&agentId=${agentId}`,
      speechTimeout: 'auto',
      speechModel: 'phone_call',
      language: agent.voice_language || 'en-US',
    });
    
    // Log the call initiation in the database
    const formData = await request.formData();
    const callSid = formData.get('CallSid') as string;
    const from = formData.get('From') as string;
    const to = formData.get('To') as string;
    
    if (callSid) {
      await supabase.from('voice_calls').insert([
        {
          lead_id: leadId,
          agent_id: agentId,
          call_sid: callSid,
          from_number: from,
          to_number: to,
          status: 'initiated',
        }
      ]);
      
      // Log the initial greeting in the transcript
      await supabase.from('call_transcripts').insert([
        {
          call_sid: callSid,
          lead_id: leadId,
          role: 'assistant',
          content: greeting,
        }
      ]);
    }
    
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error in voice connect:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
