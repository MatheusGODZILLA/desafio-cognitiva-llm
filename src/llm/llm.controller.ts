import { Controller, Get, Post, Body } from '@nestjs/common';
import { LlmService } from './llm.service';
import { PromptDto } from 'src/dto/prompt.dto';

interface ScoresDto {
  clarity: number;
  accuracy: number;
  creativity: number;
  grammar: number;
}

interface EvaluationResponseDto {
  modelName: string;
  scores: ScoresDto;
}

interface GenerateTextResponseDto {
  prompt: string;
  responses: Record<string, string>;
  evaluations: EvaluationResponseDto[];
  bestResponse: EvaluationResponseDto;
}

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Get()
  getHello(): string {
    return 'Rota de envio de prompts';
  }

  @Post('generate')
  async generateText(
    @Body() promptDto: PromptDto,
  ): Promise<GenerateTextResponseDto> {
    const result = await this.llmService.generateResponses(promptDto.prompt);

    return {
      prompt: promptDto.prompt,
      responses: result.responses,
      evaluations: result.evaluations,
      bestResponse: result.bestResponse,
    };
  }
}
