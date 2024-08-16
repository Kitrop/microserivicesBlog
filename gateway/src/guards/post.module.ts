import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { CheckIsLogoutUserGuard } from 'src/guards/login.guard'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { jwtModuleConfig, kafkaConfig } from 'src/config'
import { AdminGuard } from '../guards/admin.guard'
import { PostController } from 'src/post/post.controller'

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
  controllers: [PostController],
  providers: [CheckIsLogoutUserGuard, CheckIsLoginUserGuard, AdminGuard, ConfigService],
})
export class PostModule {}
