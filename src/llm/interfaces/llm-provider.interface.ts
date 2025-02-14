export interface ILlmProvider {
  generateText(prompt: string): Promise<{ response?: string; error?: string }>;
}
