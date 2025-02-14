import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GeminiService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  async generateText(prompt: string) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
      const result = await model.generateContent(prompt);
      return { response: result.response.text() };
    } catch (error) {
      console.error('Erro na API do Gemini:', error);
      return { error: 'Erro ao gerar resposta' };
    }
  }
}
