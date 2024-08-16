import { Body, Controller, Delete, Get, HttpStatus, Inject, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { CreatePostDto, DeletePostDto, GetPostsDto } from 'src/dto/post.dto'
import { ReturnedCreatePost, ReturnedDeleteAdminPost, ReturnedDeletePost, ReturnedGetAllPosts } from 'src/dto/returnDto/r_post.dto'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'

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
  @ApiBody({ type: GetPostsDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'get all posts', type: ReturnedGetAllPosts })
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
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'create post', type: ReturnedCreatePost })
  createPost(@Body() body: CreatePostDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('createPost', { ...body, accessToken }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Delete('deletePost')
  @ApiBody({ type: DeletePostDto })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'post delete', type: ReturnedDeletePost })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'user not is author of this post' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'post not found' })
  async deleteMyPost(@Body() body: DeletePostDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('deleteMyPost', { ...body, accessToken }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Delete('deletePostAdmin')
  @ApiBody({ type: DeletePostDto })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'post delete', type: ReturnedDeleteAdminPost })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'user not is admin' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'post not found' })
  async deletePostAdmin(@Body() body: DeletePostDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('deletePostAdmin', { ...body, accessToken }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }
}
