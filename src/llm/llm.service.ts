import { Injectable } from '@nestjs/common';
import { GeminiService } from './providers/gemini/gemini.service';
import { DeepSeekService } from './providers/deepseek/deepseek.service';
import { LlamaService } from './providers/llama/llama.service';

interface EvaluationCriteria {
  clarity: number;
  accuracy: number;
  creativity: number;
  grammar: number;
}

interface EvaluationResponse {
  modelName: string;
  scores: EvaluationCriteria;
  finalScore: number;
}

interface LLMResult {
  response?: string;
  error?: string;
}

@Injectable()
export class LlmService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly deepseekService: DeepSeekService,
    private readonly llamaService: LlamaService,
  ) {}

  async generateResponses(prompt: string) {
    const [geminiRes, deepseekRes, llamaRes] = await Promise.all([
      this.geminiService.generateText(prompt),
      this.deepseekService.generateText(prompt),
      this.llamaService.generateText(prompt),
    ]);

    const responses: Record<string, string> = {
      gemini: geminiRes.response || geminiRes.error || '',
      deepseek: deepseekRes.response || deepseekRes.error || '',
      llama: llamaRes.response || llamaRes.error || '',
    };

    const evaluations = await this.evaluateResponses(responses, prompt);

    return {
      responses,
      evaluations,
      bestResponse: this.getBestResponse(evaluations),
    };
  }

  private async evaluateResponses(
    responses: Record<string, string>,
    prompt: string,
  ): Promise<EvaluationResponse[]> {
    const evaluationPromises = Object.entries(responses).map(
      ([modelName, response]) =>
        this.evaluateResponse(response, responses, modelName, prompt),
    );
    return Promise.all(evaluationPromises);
  }

  private async evaluateResponse(
    response: string,
    allResponses: Record<string, string>,
    modelName: string,
    prompt: string,
  ): Promise<EvaluationResponse> {
    const criteria = ['clarity', 'accuracy', 'creativity', 'grammar'];

    const extractScore = (text: string): number => {
      const match = text.match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[0]) : 0;
    };

    const evaluationPromises = criteria.map(async (criterion) => {
      const evaluationPrompt = `Avalie a seguinte resposta para a pergunta "${prompt}" com base no critério de ${criterion}:\n\n"${response}"\n\nRespostas dos outros modelos:\n\n${Object.entries(
        allResponses,
      )
        .filter(([name]) => name !== modelName)
        .map(([name, resp]) => `${name}: "${resp}"`)
        .join('\n\n')}\n\nDê uma nota inteira de 0 a 10.`;

      const [geminiEval, deepseekEval, llamaEval] = await Promise.all([
        this.geminiService.generateText(evaluationPrompt),
        this.deepseekService.generateText(evaluationPrompt),
        this.llamaService.generateText(evaluationPrompt),
      ]);

      const scores = [geminiEval, deepseekEval, llamaEval].map(
        (res: LLMResult) => extractScore(res.response || ''),
      );
      return { criterion, scores };
    });

    const evaluations = await Promise.all(evaluationPromises);

    const scores: EvaluationCriteria = evaluations.reduce(
      (acc, { criterion, scores }) => {
        const averageScore =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return { ...acc, [criterion]: Math.round(averageScore) };
      },
      { clarity: 0, accuracy: 0, creativity: 0, grammar: 0 },
    );

    const finalScore =
      (scores.clarity + scores.accuracy + scores.creativity + scores.grammar) /
      4;

    return { modelName, scores, finalScore: parseFloat(finalScore.toFixed(2)) };
  }

  private getBestResponse(evaluations: EvaluationResponse[]): {
    bestResponse: { modelName: string; finalScore: number };
    ranking: { modelName: string; finalScore: number }[];
  } {
    const sorted = [...evaluations].sort((a, b) => b.finalScore - a.finalScore);

    const ranking = sorted.map(({ modelName, finalScore }) => ({
      modelName,
      finalScore,
    }));
    return {
      bestResponse: ranking[0],
      ranking,
    };
  }
}
