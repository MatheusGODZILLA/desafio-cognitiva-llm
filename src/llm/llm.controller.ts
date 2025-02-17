import { Controller, Get, Post, Body } from '@nestjs/common';
import { LlmService } from './llm.service';
import { PromptDto } from 'src/dto/prompt.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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

@ApiTags('llm')
@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Get()
  @ApiOperation({ summary: 'Mensagem de boas-vindas' })
  @ApiResponse({ status: 200, description: 'Rota de envio de prompts' })
  getHello(): string {
    return 'Rota de envio de prompts';
  }

  @Post('generate')
  @ApiOperation({ summary: 'Gerar texto a partir de um prompt' })
  @ApiResponse({
    status: 201,
    description:
      'O prompt será enviado para os três modelos, Gemini, Deepseek e Llama, e será retornado o texto gerado por cada um, juntamente com as avaliações de cada um e a melhor resposta.',
    schema: {
      type: 'object',
      properties: {
        prompt: { type: 'string' },
        responses: {
          type: 'object',
          additionalProperties: { type: 'string' },
        },
        evaluations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              modelName: { type: 'string' },
              scores: {
                type: 'object',
                properties: {
                  clarity: { type: 'number' },
                  accuracy: { type: 'number' },
                  creativity: { type: 'number' },
                  grammar: { type: 'number' },
                },
              },
            },
          },
        },
        bestResponse: {
          type: 'object',
          properties: {
            modelName: { type: 'string' },
            scores: {
              type: 'object',
              properties: {
                clarity: { type: 'number' },
                accuracy: { type: 'number' },
                creativity: { type: 'number' },
                grammar: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
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
