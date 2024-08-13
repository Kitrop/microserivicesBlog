import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { Request, Response } from 'express'
import { CreatePostDto, GetPostsDto } from 'src/dto/post.dto'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'

@Controller('post')
export class PostController {
  constructor(
    @Inject('POST_COMMENT_SERVICE')
    private postCommentClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const topics = ['allPost', 'createPost']
    topics.forEach((topic) => this.postCommentClient.subscribeToResponseOf(topic))
    await this.postCommentClient.connect()
  }

  async onModuleDestroy() {
    await this.postCommentClient.close()
  }

  @Get('all')
  allPosts(@Body() body: GetPostsDto, @Res() res: Response) {
    this.postCommentClient.send('allPost', body).subscribe(
      (result) => {
        res.send(result).status(result.statusCode)
      },
      (error) => {
        res.status(error.error.statusCode).send(error)
      },
    )
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Post('createPost')
  createPost(@Body() body: CreatePostDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('createPost', { ...body, accessToken }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }
}
