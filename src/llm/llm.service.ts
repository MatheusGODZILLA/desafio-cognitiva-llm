import { Injectable } from '@nestjs/common';
import { GeminiService } from './providers/gemini/gemini.service';

@Injectable()
export class LlmService {
  constructor(private readonly geminiService: GeminiService) {}

  async generateFromGemini(prompt: string) {
    return this.geminiService.generateText(prompt);
  }
}
