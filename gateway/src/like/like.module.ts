import { Module } from '@nestjs/common'
import { LikeController } from './like.controller'
import { ClientsModule } from '@nestjs/microservices'
import { jwtModuleConfig, kafkaConfig } from 'src/config'
import { CheckIsLogoutUserGuard } from 'src/guards/login.guard'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [ClientsModule.register([{ name: 'POST_COMMENT_SERVICE', ...kafkaConfig }]), JwtModule.register(jwtModuleConfig(process.env.SECRET_KEY))],
  controllers: [LikeController],
  providers: [CheckIsLogoutUserGuard, CheckIsLoginUserGuard, ConfigService],
})
export class LikeModule {}
