import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { GeminiService } from './providers/gemini/gemini.service';
import { DeepSeekService } from './providers/deepseek/deepseek.service';

@Module({
  controllers: [LlmController],
  providers: [LlmService, GeminiService, DeepSeekService],
})
export class LlmModule {}
