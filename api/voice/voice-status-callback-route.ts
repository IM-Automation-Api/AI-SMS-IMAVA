// /app/api/voice/status-callback/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const callSid = formData.get('CallSid') as string;
    const callStatus = formData.get('CallStatus') as string;
    const callDuration = formData.get('CallDuration') as string;
    const recordingUrl = formData.get('RecordingUrl') as string;
    
    if (!callSid) {
      return NextResponse.json(
        { error: 'Missing CallSid' },
        { status: 400 }
      );
    }
    
    // Update call status in the database
    const { error } = await supabase
      .from('voice_calls')
      .update({
        status: callStatus,
        duration: callDuration ? parseInt(callDuration) : null,
        recording_url: recordingUrl || null,
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
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in status callback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
