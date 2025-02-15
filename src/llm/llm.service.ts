import { Injectable } from '@nestjs/common';
import { GeminiService } from './providers/gemini/gemini.service';
import { DeepSeekService } from './providers/deepseek/deepseek.service';

@Injectable()
export class LlmService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly deepseekService: DeepSeekService,
  ) {}

  async generateResponses(prompt: string) {
    const [geminiResponse, deepseekResponse] = await Promise.all([
      this.geminiService.generateText(prompt),
      this.deepseekService.generateText(prompt),
    ]);

    return {
      gemini: geminiResponse,
      deepseek: deepseekResponse,
    };
  }
}
