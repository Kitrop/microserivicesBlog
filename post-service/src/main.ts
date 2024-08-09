import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'post_service-consumer',
        allowAutoTopicCreation: true,
      },
      send: {
        acks: -1,
      },
      producer: {
        idempotent: true,
        maxInFlightRequests: 1,
        allowAutoTopicCreation: true,
      },
    },
  });
  await app.listen();
}
bootstrap();
