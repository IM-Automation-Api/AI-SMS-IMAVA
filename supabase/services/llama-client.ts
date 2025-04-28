// lib/services/llama-client.ts
import axios from 'axios';
import { Message } from './ai-service';

export type LlamaResponse = {
  success: boolean;
  message?: string;
  error?: any;
};

export class LlamaAI {
  private apiKey: string;
  private baseUrl: string = 'https://api.llama-api.com'; // Replace with actual API URL

  constructor(apiKey: string)  {
    this.apiKey = apiKey;
  }

  async generateResponse(messages: Message[]): Promise<LlamaResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/chat/completions`,
        {
          model: 'llama-3-70b-chat',
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
      console.error('Error generating Llama response:', error);
      return { success: false, error };
    }
  }
}
