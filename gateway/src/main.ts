import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(json({ limit: '1mb' }));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder().setTitle('BlogJS_Kafka').setDescription('The BlogJS API description').setVersion('0.5').addTag('api').addCookieAuth('accessToken').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/document', app, document);

  await app.listen(3000);
}
bootstrap();
