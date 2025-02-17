import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Desafio Cognitiva LLM')
    .setDescription(
      'Desenvolver uma solução que acesse pelo menos três plataformas de Modelos de Linguagem de Grande Escala (LLMs) diferentes, gere respostas para uma mesma pergunta e realize uma análise comparativa da qualidade das respostas.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
