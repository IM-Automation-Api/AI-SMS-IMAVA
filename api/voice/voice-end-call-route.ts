// /app/api/voice/end-call/route.ts

import { NextResponse } from 'next/server';
import { TwilioVoiceService } from '@/lib/services/twilio-voice-service';
import { supabase } from '@/lib/supabase/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { callSid } = body;
    
    if (!callSid) {
      return NextResponse.json(
        { error: 'Missing callSid parameter' },
        { status: 400 }
      );
    }
    
    // End the call using Twilio
    const twilioService = new TwilioVoiceService();
    await twilioService.endCall(callSid);
    
    // Update call status in the database
    const { error } = await supabase
      .from('voice_calls')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('call_sid', callSid);
      
    if (error) {
      console.error('Error updating call status:', error);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Call ${callSid} ended successfully`
    });
  } catch (error) {
    console.error('Error ending call:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
