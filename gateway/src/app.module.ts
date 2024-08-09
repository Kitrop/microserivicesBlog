import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PassportModule } from '@nestjs/passport'
import { AppController } from './app.controller'
import { JwtStrategy } from './jwt.strategy'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway',
            brokers: ['localhost:9092'],
            retry: {
              // multiplier: 2,
              // initialRetryTime: 100,
              retries: 1,
            },
          },
          consumer: {
            groupId: 'gateway-consumer',
            allowAutoTopicCreation: true,
          },
          send: {
            acks: 1,
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
        },
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '300h',
      },
    }),
    ConfigModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
