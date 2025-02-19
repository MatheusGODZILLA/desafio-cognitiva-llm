import { Injectable } from '@nestjs/common';
import { ILlmProvider } from 'src/llm/interfaces/llm-provider.interface';
import * as dotenv from 'dotenv';
dotenv.config();

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

@Injectable()
export class DeepSeekService implements ILlmProvider {
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly apiKey = process.env.OPENROUTER_API_KEY_1;

  async generateText(
    prompt: string,
  ): Promise<{ response?: string; error?: string }> {
    const requestBody = {
      model: 'deepseek/deepseek-chat:free',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          // Opcional:
          // 'HTTP-Referer': process.env.YOUR_SITE_URL,
          // 'X-Title': process.env.YOUR_SITE_NAME,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { error: `Erro HTTP ${response.status}: ${errorText}` };
      }

      const result = (await response.json()) as DeepSeekResponse;
      const generatedResponse =
        result.choices?.[0]?.message?.content || 'Nenhuma resposta retornada';
      return { response: generatedResponse };
    } catch (error) {
      console.error('Erro na API do DeepSeek:', error);
      return { error: 'Erro ao gerar resposta pelo DeepSeek' };
    }
  }
}
