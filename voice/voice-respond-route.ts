// /app/api/voice/respond/route.ts

import { NextResponse } from 'next/server';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { supabase } from '@/lib/supabase/supabase';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

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
    
    // Parse form data from Twilio
    const formData = await request.formData();
    const callSid = formData.get('CallSid') as string;
    const userSpeech = formData.get('SpeechResult') as string;
    
    if (!callSid) {
      return NextResponse.json(
        { error: 'Missing CallSid' },
        { status: 400 }
      );
    }
    
    if (!userSpeech) {
      // If no speech was detected, prompt the user to speak again
      const twiml = new VoiceResponse();
      twiml.say(
        { voice: 'Polly.Joanna' },
        "I'm sorry, I didn't catch that. Could you please repeat?"
      );
      
      twiml.gather({
        input: 'speech' as any,
        action: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/respond?leadId=${leadId}&agentId=${agentId}`,
        speechTimeout: 'auto',
        speechModel: 'phone_call',
      });
      
      return new NextResponse(twiml.toString(), {
        headers: {
          'Content-Type': 'text/xml',
        },
      });
    }
    
    // Log the user's speech in the database
    await supabase.from('call_transcripts').insert([
      {
        call_sid: callSid,
        lead_id: leadId,
        role: 'user',
        content: userSpeech,
      }
    ]);
    
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
    
    // Get conversation history
    const { data: history, error: historyError } = await supabase
      .from('call_transcripts')
      .select('*')
      .eq('call_sid', callSid)
      .order('created_at', { ascending: true });
      
    if (historyError) {
      console.error('Error fetching conversation history:', historyError);
      return NextResponse.json(
        { error: 'Failed to fetch conversation history' },
        { status: 500 }
      );
    }
    
    // Format conversation history for AI
    const messages = [
      { role: 'system', content: agent.system_prompt },
      ...history.map((item: any) => ({
        role: item.role,
        content: item.content,
      })),
    ];
    
    // Get AI response
    const completion = await openai.chat.completions.create({
      model: agent.model || 'gpt-4',
      messages: messages as any,
      max_tokens: 150,
      temperature: 0.7,
    });
    
    const aiResponse = completion.choices[0].message.content || '';
    
    // Log the AI response
    await supabase.from('call_transcripts').insert([
      {
        call_sid: callSid,
        lead_id: leadId,
        role: 'assistant',
        content: aiResponse,
      }
    ]);
    
    // Create TwiML response
    const twiml = new VoiceResponse();
    
    // Have the AI agent respond
    twiml.say(
      { voice: agent.voice_name || 'Polly.Joanna' as any },
      aiResponse
    );
    
    // Check if the conversation should end
    const shouldEndCall = aiResponse.toLowerCase().includes('goodbye') || 
                          aiResponse.toLowerCase().includes('thank you for your time') ||
                          aiResponse.toLowerCase().includes('end of call');
    
    if (shouldEndCall) {
      // End the call
      twiml.hangup();
      
      // Update call status
      await supabase
        .from('voice_calls')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('call_sid', callSid);
    } else {
      // Continue gathering user input
      twiml.gather({
        input: 'speech' as any,
        action: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/respond?leadId=${leadId}&agentId=${agentId}`,
        speechTimeout: 'auto',
        speechModel: 'phone_call',
        language: agent.voice_language || 'en-US',
      });
    }
    
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error in voice respond:', error);
    
    // Create a simple TwiML response for error cases
    const twiml = new VoiceResponse();
    twiml.say(
      { voice: 'Polly.Joanna' },
      "I'm sorry, but I'm having trouble processing your request. Please try again later."
    );
    twiml.hangup();
    
    return new NextResponse(twiml.toString(), {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}
