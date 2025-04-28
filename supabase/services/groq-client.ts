// lib/services/groq-client.ts
import axios from 'axios';
import { Message } from './ai-service';

export type GroqResponse = {
  success: boolean;
  message?: string;
  error?: any;
};

export class GroqAI {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com';

  constructor(apiKey: string)  {
    this.apiKey = apiKey;
  }

  async generateResponse(messages: Message[]): Promise<GroqResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/chat/completions`,
        {
          model: 'llama3-70b-8192',
          messages,
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const message = response.data.choices[0]?.message?.content?.trim();
      return message ? { success: true, message } : { success: false, error: 'No response generated' };
    } catch (error) {
      console.error('Error generating Groq response:', error);
      return { success: false, error };
    }
  }
}
