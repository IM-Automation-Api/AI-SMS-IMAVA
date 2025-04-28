// This is a placeholder file for the voice context provider
// It would be implemented in a real project to manage voice call state

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TwilioVoiceService } from '../services/twilio-voice-service';

type VoiceContextType = {
  activeCall: any | null;
  callStatus: string;
  callDuration: number;
  isCallInProgress: boolean;
  initiateCall: (leadId: string, agentId: string, fromNumber: string) => Promise<void>;
  endCall: () => Promise<void>;
};

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

const twilioVoiceService = new TwilioVoiceService();

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCall, setActiveCall] = useState<any | null>(null);
  const [callStatus, setCallStatus] = useState<string>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [durationInterval, setDurationInterval] = useState<NodeJS.Timeout | null>(null);

  const isCallInProgress = callStatus === 'in-progress' || callStatus === 'ringing';

  useEffect(() => {
    // Clean up interval on unmount
    return () => {
      if (durationInterval) {
        clearInterval(durationInterval);
      }
    };
  }, [durationInterval]);

  useEffect(() => {
    // Start or stop duration timer based on call status
    if (isCallInProgress && !durationInterval) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      setDurationInterval(interval);
    } else if (!isCallInProgress && durationInterval) {
      clearInterval(durationInterval);
      setDurationInterval(null);
    }
  }, [isCallInProgress, durationInterval]);

  const initiateCall = async (leadId: string, agentId: string, fromNumber: string) => {
    try {
      setCallStatus('initiating');
      const callSid: string = await twilioVoiceService.initiateCall(
        leadId,
        agentId,
        fromNumber,
        'toNumberPlaceholder' // Replace with the actual 'toNumber' value
      );

      const response = { callSid };
      
      setActiveCall(response);
      setCallStatus('ringing');
      setCallDuration(0);
      
      // Poll for call status updates
      const statusInterval = setInterval(async () => {
        if (!response.callSid) return;
        
        try {
          const status = await twilioVoiceService.getCallStatus(response.callSid);
          setCallStatus(status.status);
          
          if (status.status === 'completed' || status.status === 'failed' || status.status === 'busy' || status.status === 'no-answer') {
            clearInterval(statusInterval);
            setActiveCall(null);
            setCallDuration(status.duration || 0);
          }
        } catch (error) {
          console.error('Error polling call status:', error);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error initiating call:', error);
      setCallStatus('failed');
    }
  };

  const endCall = async () => {
    try {
      if (!activeCall?.callSid) return;
      
      setCallStatus('ending');
      await twilioVoiceService.endCall(activeCall.callSid);
      setCallStatus('completed');
      setActiveCall(null);
      
    } catch (error) {
      console.error('Error ending call:', error);
      setCallStatus('failed');
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        activeCall,
        callStatus,
        callDuration,
        isCallInProgress,
        initiateCall,
        endCall
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
