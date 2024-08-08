import { Module } from '@nestjs/common'
import { CheckIsLogoutUserGuard } from 'src/guards/login.guard'
import { JwtAuthGuard } from 'src/guards/jwt.guard'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
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
            groupId: 'gateway-consumer',
            allowAutoTopicCreation: true,
          },
          send: {
            acks: -1,
          },
          producer: {
            allowAutoTopicCreation: true,
            idempotent: true,
            maxInFlightRequests: 1,
            retry: {
              // multiplier: 2,
              // initialRetryTime: 100,
              retries: 1,
            },
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
