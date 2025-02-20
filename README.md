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
OPENROUTER_API_KEY_1='SUA_CHAVE_AQUI'
OPENROUTER_API_KEY_2='SUA_CHAVE_AQUI'
```

### Como Obter as Chaves de API
- **Google Gemini:** [Obtenha sua API Key aqui](https://aistudio.google.com/app/apikey)
- **OpenRouter (DeepSeek e Llama):** [Obtenha sua API Key aqui](https://openrouter.ai/settings/keys)

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
```

O mesmo modelo de implementação foi utilizado para o Llama, alterando apenas o valor do modelo no `requestBody`:
```typescript
export class LlamaService implements ILlmProvider {
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly apiKey = process.env.OPENROUTER_API_KEY_2;

  async generateText(
    prompt: string,
  ): Promise<{ response?: string; error?: string }> {
    const requestBody = {
      model: 'meta-llama/llama-3.3-70b-instruct:free',
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

      const result = (await response.json()) as LlamaResponse;
      const generatedResponse =
        result.choices?.[0]?.message?.content || 'Nenhuma resposta retornada';
      return { response: generatedResponse };
    } catch (error) {
      console.error('Erro na API do Llama:', error);
      return { error: 'Erro ao gerar resposta pelo Llama' };
    }
  }
}
```
Embora seja possível usar uma única API Key da OpenRouter para todos os modelos, optei por obter outra de uma conta diferente para contornar os limites de prompts por modelo.

## Fluxo de Funcionamento
1. **Recebimento do Prompt:** O usuário insere um prompt que será processado pelos três modelos LLMs configurados.
2. **Geração das Respostas:** O serviço `LlmService` chama os métodos `generateText` de cada um dos modelos para obter suas respectivas respostas.
3. **Comparação das Respostas:** Cada resposta é avaliada de acordo com quatro critérios:
   - Clareza e coerência
   - Precisão da informação
   - Criatividade ou profundidade da resposta
   - Consistência gramatical
4. **Autoavaliação Assistida por IA:** As respostas são reenviadas aos próprios modelos para que eles atribuam notas aos critérios definidos.
5. **Determinação da Melhor Resposta:** O serviço calcula a média das notas de cada critério e escolhe a melhor resposta com base na pontuação final.

## Relatório de Avaliação dos Modelos de IA

Após a análise das respostas fornecidas pelos modelos **Gemini, DeepSeek e Llama** para diferentes prompts e suas respectivas avaliações, é possível destacar algumas observações gerais sobre o desempenho de cada um.

### **1. Observações Gerais**
- **Clareza e Gramática**: O Gemini teve um bom desempenho na gramática em quase todas as respostas, garantindo um texto mais polido e coeso. Já o DeepSeek se destacou pela clareza em explicações mais técnicas, enquanto o Llama teve um desempenho mais inconsistente.
- **Precisão das Informações**: O DeepSeek se saiu melhor em precisão nas respostas mais técnicas, como a explicação de **mecânica quântica** e **Projeto Manhattan**, demonstrando um alto nível de exatidão. O Gemini apresentou algumas imprecisões nessas áreas.
- **Criatividade**: A criatividade variou dependendo do tipo de prompt. O DeepSeek teve uma abordagem mais inovadora em sugestões de marketing e campanhas publicitárias, enquanto o Gemini e o Llama tiveram respostas mais diretas.
- **Melhor Desempenho Geral**: O DeepSeek foi o modelo que mais se destacou ao longo das avaliações, conseguindo a maior pontuação final em dois prompts críticos (**Marketing Natalino** e **Mecânica Quântica**). O Gemini também teve boas avaliações, especialmente em estruturação de respostas, mas pecou em precisão. O Llama, por outro lado, teve um desempenho inferior na maioria dos testes, exceto na campanha publicitária, onde obteve a melhor nota.

### **2. Ranking dos Modelos**
1. 🏆 **DeepSeek** – Melhor desempenho geral, destacando-se em precisão, clareza e criatividade.
2. **Gemini** – Forte em estruturação e gramática, mas perdeu pontos na precisão de algumas respostas.
3. **Llama** – Desempenho mais fraco, apresentando notas inferiores na maioria das categorias.

### **3. Conclusão**
- **Se o foco for precisão e clareza em temas técnicos**, o **DeepSeek** foi o melhor modelo avaliado.
- **Se o objetivo for respostas bem estruturadas e de fácil leitura**, o **Gemini** é uma boa escolha.
- **Se for necessária uma abordagem mais criativa e diferenciada**, o **Llama** pode ser útil em alguns cenários, mas apresentou um desempenho mais inconsistente.

No geral, o DeepSeek foi o modelo que melhor combinou clareza, precisão e criatividade, sendo a melhor escolha para a maioria dos casos.

## Conclusão
Essa solução foi desenvolvida com foco na escalabilidade e facilidade de adaptação para outros modelos de LLMs. Com a implementação da interface `ILlmProvider`, é possível adicionar novos provedores de IA com poucas modificações no código.

O próximo passo de melhoria seria aprimorar a análise comparativa das respostas, incorporando um sistema de pontuação automático baseado em aprendizado de máquina ou métricas qualitativas mais detalhadas.

---

Caso tenha alguma dúvida sobre a implementação, fique à vontade para entrar em contato!

**Desenvolvido por Matheus da Silva**
