import { Injectable } from '@nestjs/common';
import { GeminiService } from './providers/gemini/gemini.service';

@Injectable()
export class LlmService {
  constructor(private readonly geminiService: GeminiService) {}

  async generateResponses(prompt: string) {
    const [geminiResponse] = await Promise.all([
      this.geminiService.generateText(prompt),
    ]);

    return {
      gemini: geminiResponse,
    };
  }
}
