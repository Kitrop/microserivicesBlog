import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Transport } from '@nestjs/microservices'
import { KafkaExceptionFilter } from './kafkaExaption.filter'
import { MessageDuplicateGuard } from './guard/duplicate.guard'

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:29092', 'kafka:9092', 'localhost:9092', 'localhost:29092', '78.24.221.183:29092', '78.24.221.183:9092'],
      },
      consumer: {
        retry: {
          initialRetryTime: 150,
          multiplier: 3,
          retries: 10,
        },
        groupId: 'post_service-consumer',
        allowAutoTopicCreation: true,
      },
      send: {
        acks: -1,
      },
      producer: {
        retry: {
          initialRetryTime: 150,
          multiplier: 3,
          retries: 10,
        },
        allowAutoTopicCreation: true,
        idempotent: true,
        maxInFlightRequests: 1,
      },
    },
  })

  app.useGlobalFilters(new KafkaExceptionFilter())
  app.useGlobalGuards(new MessageDuplicateGuard())
  await app.listen()
}
bootstrap()
