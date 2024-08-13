import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { ClientsModule } from '@nestjs/microservices'
import { CheckIsLogoutUserGuard } from 'src/guards/login.guard'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { jwtModuleConfig, kafkaConfig } from 'src/config'

@Module({
  imports: [ClientsModule.register([{ name: 'POST_COMMENT_SERVICE', ...kafkaConfig }]), JwtModule.register(jwtModuleConfig(process.env.SECRET_KEY))],
  controllers: [PostController],
  providers: [CheckIsLogoutUserGuard, CheckIsLoginUserGuard, ConfigService],
})
export class PostModule {}
