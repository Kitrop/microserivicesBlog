import { Module } from '@nestjs/common';
import { CheckIsLogoutUserGuard } from 'src/guards/login.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway',
            brokers: ['kafka:29092', 'kafka:9092', 'localhost:9092', 'localhost:29092', '78.24.221.183:29092', '78.24.221.183:9092'],
          },
          consumer: {
            retry: {
              initialRetryTime: 150,
              multiplier: 3,
              retries: 10,
            },
            groupId: 'gateway-consumer',
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
      },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '300h',
      },
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, CheckIsLogoutUserGuard],
})
export class AuthModule {}
