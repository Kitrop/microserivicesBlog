import { Transport, KafkaOptions } from '@nestjs/microservices'
import { randomBytes } from 'crypto'

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'gateway',
      brokers: ['localhost:9092'],
      retry: {
        multiplier: 2,
        initialRetryTime: 100,
        retries: 5,
      },
    },
    consumer: {
      groupId: 'gateway-consumer' + randomBytes(16).toString('hex'),
      allowAutoTopicCreation: true,
    },
    producer: {
      allowAutoTopicCreation: true,
      idempotent: true,
      maxInFlightRequests: 1,
      retry: {
        multiplier: 2,
        initialRetryTime: 100,
        retries: 5,
      },
    },
    send: {
      acks: -1,
    },
  },
}


export const jwtModuleConfig = (secret: string) => {
  return {
    secret,
    signOptions: {
      expiresIn: '300h',
    },
  }
}
