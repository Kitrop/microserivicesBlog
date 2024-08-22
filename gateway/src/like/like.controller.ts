/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import { Body, Controller, HttpStatus, Inject, Post, Req, Res, UseGuards } from '@nestjs/common'
import { LikePostDto } from 'src/dto/like.dto'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'
import { Response, Request } from 'express'
import { ClientKafka } from '@nestjs/microservices'
import { ApiTags } from '@nestjs/swagger'
import { LikeResponseLike } from 'src/decorators/like.decorator'
import { v4 as uuidv4 } from 'uuid'

@ApiTags('LIKE')
@Controller('like')
export class LikeController {
  constructor(
    @Inject('POST_COMMENT_SERVICE')
    private postCommentClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.postCommentClient.subscribeToResponseOf('like')
    await this.postCommentClient.connect()
  }

  async onModuleDestroy() {
    await this.postCommentClient.close()
  }
}
