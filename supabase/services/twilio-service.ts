import { Twilio } from 'twilio';
import { supabase } from '../supabase';

export class TwilioService {
  private client: Twilio | null = null;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  // Initialize Twilio client with credentials from database
  async initialize(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('twilio_credentials')
        .select('account_sid, auth_token, phone_number')
        .eq('user_id', this.userId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.error('Error fetching Twilio credentials:', error);
        return false;
      }

      this.client = new Twilio(data.account_sid, data.auth_token);
      return true;
    } catch (error) {
      console.error('Error initializing Twilio client:', error);
      return false;
    }
  }

  // Send SMS message
  async sendSMS(to: string, body: string, leadId: string, clientId: string): Promise<{ success: boolean; messageSid?: string; error?: any }> {
    try {
      if (!this.client) {
        const initialized = await this.initialize();
        if (!initialized) {
          return { success: false, error: 'Failed to initialize Twilio client' };
        }
      }

      const { data: credentials } = await supabase
        .from('twilio_credentials')
        .select('phone_number')
        .eq('user_id', this.userId)
        .eq('is_active', true)
        .single();

      if (!credentials) {
        return { success: false, error: 'No active Twilio credentials found' };
      }

      // Send message via Twilio
      const message = await this.client!.messages.create({
        body,
        from: credentials.phone_number,
        to
      });

      // Log message in database
      const { error: dbError } = await supabase
        .from('sms_messages')
        .insert([
          {
            lead_id: leadId,
            client_id: clientId,
            direction: 'outbound',
            content: body,
            twilio_message_sid: message.sid,
            status: message.status
          }
        ]);

      if (dbError) {
        console.error('Error logging SMS message:', dbError);
      }

      return { success: true, messageSid: message.sid };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error };
    }
  }

  // Get message status
  async getMessageStatus(messageSid: string): Promise<{ status: string; error?: any }> {
    try {
      if (!this.client) {
        const initialized = await this.initialize();
        if (!initialized) {
          return { status: 'unknown', error: 'Failed to initialize Twilio client' };
        }
      }

      const message = await this.client!.messages(messageSid).fetch();
      return { status: message.status };
    } catch (error) {
      console.error('Error fetching message status:', error);
      return { status: 'error', error };
    }
  }
}
