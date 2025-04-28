// lib/services/deepseek-client.ts
import axios from 'axios';
import { Message } from './ai-service';

export type DeepSeekResponse = {
  success: boolean;
  message?: string;
  error?: any;
};

export class DeepSeekAI {
  private apiKey: string;
  private baseUrl: string = 'https://api.deepseek.com'; // Replace with actual API URL

  constructor(apiKey: string)  {
    this.apiKey = apiKey;
  }

  async generateResponse(messages: Message[]): Promise<DeepSeekResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/chat/completions`,
        {
          model: 'deepseek-chat',
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
      console.error('Error generating DeepSeek response:', error);
      return { success: false, error };
    }
  }
}
