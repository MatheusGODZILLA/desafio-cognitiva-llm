import { IsString, IsNotEmpty } from 'class-validator';

export class PromptDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
