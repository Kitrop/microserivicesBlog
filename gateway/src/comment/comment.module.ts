import { Module } from '@nestjs/common'
import { CommentController } from './comment.controller'
import { ClientsModule } from '@nestjs/microservices'
import { jwtModuleConfig, kafkaConfig } from 'src/config'
import { JwtModule } from '@nestjs/jwt'
import { CheckIsLogoutUserGuard } from 'src/guards/login.guard'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'
import { ConfigService } from '@nestjs/config'
import { AdminGuard } from 'src/guards/admin.guard'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'POST_COMMENT_SERVICE',
        ...kafkaConfig,
      },
    ]),
    JwtModule.register(jwtModuleConfig(process.env.SECRET_KEY)),
  ],
  controllers: [CommentController],
  providers: [CheckIsLogoutUserGuard, CheckIsLoginUserGuard, AdminGuard, ConfigService],
})
export class CommentModule {}
