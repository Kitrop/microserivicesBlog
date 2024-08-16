import { Body, Controller, HttpStatus, Inject, Post, Req, Res, UseGuards } from '@nestjs/common'
import { LikePostDto } from 'src/dto/like.dto'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'
import { Response, Request } from 'express'
import { ClientKafka } from '@nestjs/microservices'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ReturnedLikeDto } from 'src/dto/returnDto/r_like.dto'

@ApiTags('LIKE')
@Controller('like')
export class LikeController {
  constructor(
    @Inject('POST_COMMENT_SERVICE')
    private postCommentClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const topics = ['like']
    topics.forEach((topic) => this.postCommentClient.subscribeToResponseOf(topic))
    await this.postCommentClient.connect()
  }

  async onModuleDestroy() {
    await this.postCommentClient.close()
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Post('')
  @ApiBody({ type: LikePostDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'user like/dislike post', type: ReturnedLikeDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'post not found/incorrect post' })
  like(@Body() body: LikePostDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('like', { ...body, accessToken }).subscribe(
      (result) => {
        res.send(result).status(result.status)
      },
      (error) => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
      },
    )
  }
}
