import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmService } from './llm/llm.service';
import { LlmController } from './llm/llm.controller';
import { LlmModule } from './llm/llm.module';
import { GeminiService } from './llm/providers/gemini/gemini.service';
import { DeepSeekService } from './llm/providers/deepseek/deepseek.service';
import { LlamaService } from './llm/providers/llama/llama.service';

@Module({
  imports: [LlmModule],
  controllers: [AppController, LlmController],
  providers: [
    AppService,
    LlmService,
    GeminiService,
    DeepSeekService,
    LlamaService,
  ],
})
export class AppModule {}
