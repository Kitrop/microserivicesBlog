import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MessageDuplicateGuard } from './guard/duplicate.guard';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092']
      },
      consumer: {
        groupId: 'auth_service-consumer',
        allowAutoTopicCreation: true,
        retry: {
          initialRetryTime: 150,
          multiplier: 3,
          retries: 10
        }
      },
      send: {
        acks: -1
      },
      producer: {
        retry: {
          initialRetryTime: 150,
          multiplier: 3,
          retries: 10
        },
        allowAutoTopicCreation: true,
        idempotent: true,
        maxInFlightRequests: 1
      }
    }
  });
  app.useGlobalGuards(new MessageDuplicateGuard());
  await app.listen();
}
bootstrap();
