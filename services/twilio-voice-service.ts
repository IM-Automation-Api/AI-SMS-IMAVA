import twilio from 'twilio';

export class TwilioVoiceService {
  private client: twilio.Twilio;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured');
    }

    this.client = twilio(accountSid, authToken);
  }

  /**
   * Initiates a call to a lead using Twilio
   */
  async initiateCall(
    leadId: string | number,
    agentId: string | number,
    fromNumber: string,
    toNumber: string
  ): Promise<string> {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      
      const call = await this.client.calls.create({
        url: `${appUrl}/api/voice/connect?leadId=${leadId}&agentId=${agentId}`,
        to: toNumber,
        from: fromNumber,
        statusCallback: `${appUrl}/api/voice/status-callback`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
      });
      
      return call.sid;
    } catch (error) {
      console.error('Error initiating Twilio call:', error);
      throw error;
    }
  }

  /**
   * Ends an active call
   */
  async endCall(callSid: string): Promise<void> {
    try {
      await this.client.calls(callSid).update({
        status: 'completed',
      });
    } catch (error) {
      console.error('Error ending Twilio call:', error);
      throw error;
    }
  }

  /**
   * Gets information about a call
   */
  async getCallInfo(callSid: string): Promise<any> {
    try {
      return await this.client.calls(callSid).fetch();
    } catch (error) {
      console.error('Error fetching Twilio call info:', error);
      throw error;
    }
  }
}
