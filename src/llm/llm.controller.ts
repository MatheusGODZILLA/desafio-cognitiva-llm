import { Controller, Get, Post, Body } from '@nestjs/common';
import { LlmService } from './llm.service';
import { PromptDto } from 'src/dto/prompt.dto';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Get()
  getHello(): string {
    return 'Rota de envio de prompts';
  }

  @Post('generate')
  async generateText(@Body() promptDto: PromptDto) {
    const responses = await this.llmService.generateResponses(promptDto.prompt);

    return responses;
  }
}
