// lib/services/ai-service.ts
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { LlamaAI } from './llama-client'; // Custom implementation
import { DeepSeekAI } from './deepseek-client'; // Custom implementation
import { GroqAI } from './groq-client'; // Custom implementation

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type AIResponse = {
  success: boolean;
  message?: string;
  error?: any;
};

export class AIService {
  private provider: string;
  private apiKey: string;
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;
  private llama: LlamaAI | null = null;
  private deepseek: DeepSeekAI | null = null;
  private groq: GroqAI | null = null;

  constructor(provider: string, apiKey: string) {
    this.provider = provider;
    this.apiKey = apiKey;
    this.initializeClient();
  }

  private initializeClient() {
    switch (this.provider) {
      case 'openai':
        this.openai = new OpenAI({ apiKey: this.apiKey });
        break;
      case 'claude':
        this.anthropic = new Anthropic({ apiKey: this.apiKey });
        break;
      case 'llama':
        this.llama = new LlamaAI(this.apiKey);
        break;
      case 'deepseek':
        this.deepseek = new DeepSeekAI(this.apiKey);
        break;
      case 'groq':
        this.groq = new GroqAI(this.apiKey);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${this.provider}`);
    }
  }

  async generateResponse(systemPrompt: string, conversation: any[]): Promise<AIResponse> {
    try {
      // Format conversation history
      const messages: Message[] = [
        { role: 'system', content: systemPrompt },
        ...conversation.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      // Generate response based on provider
      switch (this.provider) {
        case 'openai':
          return await this.generateOpenAIResponse(messages);
        case 'claude':
          return await this.generateClaudeResponse(messages);
        case 'llama':
          return await this.generateLlamaResponse(messages);
        case 'deepseek':
          return await this.generateDeepSeekResponse(messages);
        case 'groq':
          return await this.generateGroqResponse(messages);
        default:
          return { success: false, error: `Unsupported AI provider: ${this.provider}` };
      }
    } catch (error) {
      console.error(`Error generating AI response with ${this.provider}:`, error);
      return { success: false, error };
    }
  }

  private async generateOpenAIResponse(messages: Message[]): Promise<AIResponse> {
    if (!this.openai) {
      return { success: false, error: 'OpenAI client not initialized' };
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500
    });

    const message = response.choices[0]?.message?.content?.trim();
    return message ? { success: true, message } : { success: false, error: 'No response generated' };
  }

  private async generateClaudeResponse(messages: Message[]): Promise<AIResponse> {
    if (!this.anthropic) {
      return { success: false, error: 'Anthropic client not initialized' };
    }

    // Convert messages to Anthropic format
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const response = await this.anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      system: systemPrompt,
      messages: conversationMessages as any,
      max_tokens: 500
    });

    const message = response.content[0]?.text?.trim(); // Replace 'content' with the correct property, e.g., 'text'
    return message ? { success: true, message } : { success: false, error: 'No response generated' };
  }

  private async generateLlamaResponse(messages: Message[]): Promise<AIResponse> {
    if (!this.llama) {
      return { success: false, error: 'Llama client not initialized' };
    }

    const response = await this.llama.generateResponse(messages);
    return response.success ? response : { success: false, error: 'Failed to generate Llama response' };
  }

  private async generateDeepSeekResponse(messages: Message[]): Promise<AIResponse> {
    if (!this.deepseek) {
      return { success: false, error: 'DeepSeek client not initialized' };
    }

    const response = await this.deepseek.generateResponse(messages);
    return response.success ? response : { success: false, error: 'Failed to generate DeepSeek response' };
  }

  private async generateGroqResponse(messages: Message[]): Promise<AIResponse> {
    if (!this.groq) {
      return { success: false, error: 'Groq client not initialized' };
    }

    const response = await this.groq.generateResponse(messages);
    return response.success ? response : { success: false, error: 'Failed to generate Groq response' };
  }
}
