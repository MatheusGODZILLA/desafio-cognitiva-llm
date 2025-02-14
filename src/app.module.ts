import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmService } from './llm/llm.service';
import { LlmController } from './llm/llm.controller';
import { LlmModule } from './llm/llm.module';
import { GeminiService } from './providers/gemini/gemini.service';

@Module({
  imports: [LlmModule],
  controllers: [AppController, LlmController],
  providers: [AppService, LlmService, GeminiService],
})
export class AppModule {}
