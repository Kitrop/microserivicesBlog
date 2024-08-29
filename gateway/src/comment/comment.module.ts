import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { jwtModuleConfig } from 'src/config';
import { JwtModule } from '@nestjs/jwt';
import { CheckIsLogoutUserGuard } from 'src/guards/login.guard';
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard';
import { ConfigService } from '@nestjs/config';
import { AdminGuard } from 'src/guards/admin.guard';
import { randomBytes } from 'crypto';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'POST_COMMENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway',
            brokers: ['kafka:29092'],
          },
          consumer: {
            retry: {
              initialRetryTime: 150,
              multiplier: 3,
              retries: 10,
            },
            groupId: 'gateway-consumer' + randomBytes(16).toString('hex'),
            allowAutoTopicCreation: true,
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
          send: {
            acks: -1,
          },
        },
      },
    ]),
    JwtModule.register(jwtModuleConfig(process.env.SECRET_KEY)),
  ],
  controllers: [CommentController],
  providers: [CheckIsLogoutUserGuard, CheckIsLoginUserGuard, AdminGuard, ConfigService],
})
export class CommentModule {}
