# Desafio Técnico - Desenvolvedor Cognitiva Brasil

## Objetivo
Desenvolver uma solução que acesse pelo menos três plataformas de Modelos de Linguagem de Grande Escala (LLMs) diferentes, gere respostas para uma mesma pergunta e realize uma análise comparativa da qualidade das respostas.

## Tecnologias Utilizadas
- **Framework:** NestJS
- **Linguagem:** TypeScript
- **Documentação:** Swagger
- **APIs Utilizadas:**
  - Gemini (Google Generative AI)
  - DeepSeek (DeepSeek AI via OpenRouter)
  - Llama (Meta AI via OpenRouter)

## Implementação
A aplicação segue uma arquitetura modularizada, garantindo escalabilidade e flexibilidade para futuras implementações. Para garantir um padrão unificado na chamada das APIs, foi criada a interface `ILlmProvider`:

```typescript
export interface ILlmProvider {
  generateText(prompt: string): Promise<{ response?: string; error?: string }>;
}
```

Cada modelo foi implementado como um serviço separado:
### Gemini
A API do Gemini foi integrada utilizando o SDK oficial:

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService implements ILlmProvider {
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
```

### DeepSeek e Llama (via OpenRouter)
Para acessar os modelos gratuitos DeepSeek V3 e Llama 3.3 70B Instruct, utilizei a OpenRouter:

```typescript
export class DeepSeekService implements ILlmProvider {
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly apiKey = process.env.OPENROUTER_API_KEY;

  async generateText(prompt: string): Promise<{ response?: string; error?: string }> {
    const requestBody = {
      model: 'deepseek/deepseek-chat:free',
      messages: [{ role: 'user', content: prompt }],
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        return { error: `Erro HTTP ${response.status}: ${await response.text()}` };
      }

      const result = await response.json();
      return { response: result.choices?.[0]?.message?.content || 'Nenhuma resposta retornada' };
    } catch (error) {
      console.error('Erro na API do DeepSeek:', error);
      return { error: 'Erro ao gerar resposta pelo DeepSeek' };
    }
  }
}
```

O mesmo modelo de implementação foi utilizado para o Llama, alterando apenas o valor do modelo no `requestBody`.

## Comparação de Respostas
A aplicação recebe uma pergunta do usuário e gera respostas utilizando os três modelos mencionados. Em seguida, as respostas são analisadas com base nos seguintes critérios:
- **Clareza e coerência**
- **Precisão da informação**
- **Criatividade ou profundidade da resposta**
- **Consistência gramatical**

Além disso, a solução também envia as respostas obtidas para um modelo de IA e solicita que ele as ranqueie, realizando uma autoavaliação assistida por IA.

## Configuração do Projeto
### Instalação das Dependências
```bash
$ npm install
```
### Execução do Projeto
```bash
# Modo desenvolvimento
$ npm run start

# Modo observador
$ npm run start:dev

# Modo produção
$ npm run start:prod
```
### Execução dos Testes
```bash
# Testes unitários
$ npm run test

# Testes de ponta a ponta (e2e)
$ npm run test:e2e

# Cobertura de testes
$ npm run test:cov
```

## Configuração de Variáveis de Ambiente
Para executar o projeto localmente, é necessário configurar um arquivo `.env` com as chaves de API:

```env
GEMINI_API_KEY='SUA_CHAVE_AQUI'
OPENROUTER_API_KEY='SUA_CHAVE_AQUI'
```

### Como Obter as Chaves de API
- **Google Gemini:** [Obtenha sua API Key aqui](https://aistudio.google.com/app/apikey)
- **OpenRouter (DeepSeek e Llama):** [Obtenha sua API Key aqui](https://openrouter.ai/settings/keys)

## Conclusão
Essa solução foi desenvolvida com foco na escalabilidade e facilidade de adaptação para outros modelos de LLMs. Com a implementação da interface `ILlmProvider`, é possível adicionar novos provedores de IA com poucas modificações no código.

O próximo passo seria aprimorar a análise comparativa das respostas, incorporando um sistema de pontuação automático baseado em aprendizado de máquina ou métricas qualitativas mais detalhadas.

---

Caso tenha alguma dúvida sobre a implementação, fique à vontade para entrar em contato!

**Desenvolvido por Matheus da Silva**

