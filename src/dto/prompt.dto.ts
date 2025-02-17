import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PromptDto {
  @ApiProperty({
    description: 'O prompt para gerar texto',
    example: 'Explique como funciona as LLMs',
  })
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
