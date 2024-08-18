import { Body, Controller, Delete, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { AdminDeletePostResponseLike, DeletePostResponseLike } from 'src/decorators/post.decorator'
import { CreatePostDto, DeletePostDto, GetPostsDto } from 'src/dto/post.dto'

import { AdminGuard } from 'src/guards/admin.guard'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'
import { CreatePostResponseLike, AllPostResponseLike } from '../decorators/post.decorator'

@ApiTags('POSTS')
@Controller('post')
export class PostController {
  constructor(@Inject('POST_COMMENT_SERVICE') private postCommentClient: ClientKafka) {}

  async onModuleInit() {
    const topics = ['allPost', 'createPost', 'deletePostAdmin', 'deleteMyPost']
    topics.forEach((topic) => this.postCommentClient.subscribeToResponseOf(topic))
    await this.postCommentClient.connect()
  }

  async onModuleDestroy() {
    await this.postCommentClient.close()
  }

  @Get('all')
  @AllPostResponseLike()
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
  @CreatePostResponseLike()
  createPost(@Body() body: CreatePostDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('createPost', { ...body, accessToken }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Delete('deletePost')
  @DeletePostResponseLike()
  async deleteMyPost(@Body() body: DeletePostDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('deleteMyPost', { ...body, accessToken }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }

  @UseGuards(AdminGuard)
  @Delete('deletePostAdmin')
  @AdminDeletePostResponseLike()
  async deletePostAdmin(@Body() body: DeletePostDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('deletePostAdmin', { ...body, accessToken }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }
}
