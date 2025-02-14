import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmService } from './llm/llm.service';
import { LlmController } from './llm/llm.controller';
import { LlmModule } from './llm/llm.module';

@Module({
  imports: [LlmModule],
  controllers: [AppController, LlmController],
  providers: [AppService, LlmService],
})
export class AppModule {}
