import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092']
        },
        consumer: {
          groupId: 'auth_service-consumer',
          allowAutoTopicCreation: true
        },
        send: {
          acks: -1
        },
        producer: {
          allowAutoTopicCreation: true,
          idempotent: true,
          maxInFlightRequests: 1,
          retry: {
            multiplier: 2,
            initialRetryTime: 100,
            retries: 5
          }
        }
      }
    }
  )
  app.useGlobalPipes(new ValidationPipe())
  await app.listen()
}
bootstrap()
