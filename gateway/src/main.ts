import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  const config = new DocumentBuilder().setTitle('BlogJS_Kafka').setDescription('The BlogJS API description').setVersion('0.1').addTag('api').addCookieAuth('accessToken').build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('', app, document)

  await app.listen(3000)
}
bootstrap()
