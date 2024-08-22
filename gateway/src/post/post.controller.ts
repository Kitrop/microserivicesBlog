import { Body, Controller, Delete, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { AdminDeletePostResponseLike, DeletePostResponseLike } from '../decorators/post.decorator'
import { CreatePostDto, DeletePostDto, GetPostsDto } from '../dto/post.dto'
import { AdminGuard } from '../guards/admin.guard'
import { CheckIsLoginUserGuard } from '../guards/logout.guard'
import { CreatePostResponseLike, AllPostResponseLike } from '../decorators/post.decorator'
import { Throttle } from '@nestjs/throttler'
import { v4 as uuidv4 } from 'uuid'
import { LikeResponseLike } from '../decorators/like.decorator'
import { LikePostDto } from '../dto/like.dto'

@ApiTags('POSTS')
@Controller('post')
export class PostController {
  constructor(@Inject('POST_COMMENT_SERVICE') private postCommentClient: ClientKafka) {}

  async onModuleInit() {
    const topics = ['allPost', 'createPost', 'deletePostAdmin', 'deleteMyPost', 'like']
    topics.forEach((topic) => this.postCommentClient.subscribeToResponseOf(topic))
    await this.postCommentClient.connect()
  }

  async onModuleDestroy() {
    await this.postCommentClient.close()
  }

  @Get('all')
  @Throttle({
    default: {
      ttl: 10000,
      limit: 5,
    },
  })
  @AllPostResponseLike()
  allPosts(@Body() body: GetPostsDto, @Res() res: Response) {
    const messageId = uuidv4()
    this.postCommentClient.send('allPost', { ...body, messageId }).subscribe(
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
  @CreatePostResponseLike()
  createPost(@Body() body: CreatePostDto, @Res() res: Response, @Req() req: Request) {
    const messageId = uuidv4()
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('createPost', { ...body, accessToken, messageId }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Delete('deletePost')
  @DeletePostResponseLike()
  async deleteMyPost(@Body() body: DeletePostDto, @Res() res: Response, @Req() req: Request) {
    const messageId = uuidv4()
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('deleteMyPost', { ...body, accessToken, messageId }).subscribe(
      (result) => {
        res.status(result.statusCode).json(result)
      },
      (error) => {
        console.log(error)
        res.status(error['error']['statusCode']).send(error)
      },
    )
  }

  @UseGuards(AdminGuard)
  @Delete('deletePostAdmin')
  @AdminDeletePostResponseLike()
  async deletePostAdmin(@Body() body: DeletePostDto, @Res() res: Response, @Req() req: Request) {
    const messageId = uuidv4()
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('deletePostAdmin', { ...body, accessToken, messageId }).subscribe(
      (result) => {
        res.send(result).status(result.statusCode)
      },
      (error) => {
        console.log(error)
        res.send(error).status(error.error.statusCode)
      },
    )
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Post('like')
  @LikeResponseLike()
  like(@Body() body: LikePostDto, @Res() res: Response, @Req() req: Request) {
    const messageId = uuidv4()
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('like', { ...body, accessToken, messageId }).subscribe(
      (result) => {
        res.send(result).status(result.statusCode)
      },
      (error) => {
        res.send(error.message).status(error.error.statusCode)
      },
    )
  }
}
