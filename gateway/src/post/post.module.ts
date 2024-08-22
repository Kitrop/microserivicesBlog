import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { CheckIsLogoutUserGuard } from 'src/guards/login.guard'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { jwtModuleConfig, kafkaConfig } from 'src/config'
import { AdminGuard } from '../guards/admin.guard'
import { PostController } from 'src/post/post.controller'
import { randomBytes } from 'crypto'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'POST_COMMENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'gateway-consumer' + randomBytes(16).toString('hex'),
            allowAutoTopicCreation: true,
          },
          producer: {
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
  controllers: [PostController],
  providers: [CheckIsLogoutUserGuard, CheckIsLoginUserGuard, AdminGuard, ConfigService],
})
export class PostModule {}
