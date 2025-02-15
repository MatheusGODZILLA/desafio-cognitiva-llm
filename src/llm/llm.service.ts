import { Injectable } from '@nestjs/common';
import { GeminiService } from './providers/gemini/gemini.service';
import { DeepSeekService } from './providers/deepseek/deepseek.service';
import { LlamaService } from './providers/llama/llama.service';

@Injectable()
export class LlmService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly deepseekService: DeepSeekService,
    private readonly llamaService: LlamaService,
  ) {}

  async generateResponses(prompt: string) {
    const [geminiResponse, deepseekResponse] = await Promise.all([
      this.geminiService.generateText(prompt),
      this.deepseekService.generateText(prompt),
      this.llamaService.generateText(prompt),
    ]);

    return {
      gemini: geminiResponse,
      deepseek: deepseekResponse,
      llama: deepseekResponse,
    };
  }
}
