import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { GeminiService } from './providers/gemini/gemini.service';

@Module({
  controllers: [LlmController],
  providers: [LlmService, GeminiService],
})
export class LlmModule {}
