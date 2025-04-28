// /lib/services/twilio-voice-service.ts

import { Twilio } from 'twilio';

export class TwilioVoiceService {
  private twilio: Twilio;
  
  constructor() {
    this.twilio = new Twilio(
      process.env.TWILIO_ACCOUNT_SID as string,
      process.env.TWILIO_AUTH_TOKEN as string
    );
  }
  
  /**
   * Initiates a call to a lead using Twilio
   * @param leadId The ID of the lead to call
   * @param agentId The ID of the agent to use for the call
   * @param fromNumber The Twilio phone number to call from
   * @param toNumber The lead's phone number to call
   * @returns The Twilio call SID
   */
  async initiateCall(leadId: string, agentId: string, fromNumber: string, toNumber: string): Promise<string> {
    try {
      // Create a call using Twilio
      const call = await this.twilio.calls.create({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/connect?leadId=${leadId}&agentId=${agentId}`,
        to: toNumber,
        from: fromNumber,
        statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/status-callback`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        statusCallbackMethod: 'POST',
        record: true,
      });
      
      return call.sid;
    } catch (error) {
      console.error('Error initiating call:', error);
      throw error;
    }
  }
  
  /**
   * Gets the status of a call
   * @param callSid The Twilio call SID
   * @returns The call status
   */
  async getCallStatus(callSid: string): Promise<any> {
    try {
      const call = await this.twilio.calls(callSid).fetch();
      return call;
    } catch (error) {
      console.error('Error getting call status:', error);
      throw error;
    }
  }
  
  /**
   * Ends an active call
   * @param callSid The Twilio call SID
   */
  async endCall(callSid: string): Promise<void> {
    try {
      await this.twilio.calls(callSid).update({
        status: 'completed',
      });
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  }
  
  /**
   * Gets a list of available Twilio phone numbers
   * @returns Array of available phone numbers
   */
  async getAvailablePhoneNumbers(countryCode: string = 'US'): Promise<any[]> {
    try {
      const availableNumbers = await this.twilio.availablePhoneNumbers(countryCode)
        .local
        .list({ voiceEnabled: true, limit: 20 });
      
      return availableNumbers;
    } catch (error) {
      console.error('Error getting available phone numbers:', error);
      throw error;
    }
  }
  
  /**
   * Purchases a new Twilio phone number
   * @param phoneNumber The phone number to purchase
   * @returns The purchased phone number details
   */
  async purchasePhoneNumber(phoneNumber: string): Promise<any> {
    try {
      const purchasedNumber = await this.twilio.incomingPhoneNumbers
        .create({
          phoneNumber,
          voiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/incoming`,
        });
      
      return purchasedNumber;
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      throw error;
    }
  }
  
  /**
   * Gets a list of purchased Twilio phone numbers
   * @returns Array of purchased phone numbers
   */
  async getPurchasedPhoneNumbers(): Promise<any[]> {
    try {
      const purchasedNumbers = await this.twilio.incomingPhoneNumbers.list();
      return purchasedNumbers;
    } catch (error) {
      console.error('Error getting purchased phone numbers:', error);
      throw error;
    }
  }
  
  /**
   * Gets a call recording
   * @param recordingSid The Twilio recording SID
   * @returns The recording URL
   */
  async getCallRecording(recordingSid: string): Promise<string> {
    try {
      const recording = await this.twilio.recordings(recordingSid).fetch();
      return `https://api.twilio.com${recording.uri.replace('.json', '.mp3')}`;
    } catch (error) {
      console.error('Error getting call recording:', error);
      throw error;
    }
  }
  
  /**
   * Gets a list of recordings for a call
   * @param callSid The Twilio call SID
   * @returns Array of recordings
   */
  async getCallRecordings(callSid: string): Promise<any[]> {
    try {
      const recordings = await this.twilio.recordings.list({ callSid });
      return recordings;
    } catch (error) {
      console.error('Error getting call recordings:', error);
      throw error;
    }
  }
}
