import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'
import { Request, Response } from 'express'
import { CreateCommentDto, DeleteCommentDto } from 'src/dto/comment.dto'

@Controller('comment')
export class CommentController {
  constructor(
    @Inject('POST_COMMENT_SERVICE')
    private postCommentClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const topics = ['createComment', 'getAllComments', 'deleteMyComment', 'deleteCommentAdmin']
    topics.forEach((topic) => this.postCommentClient.subscribeToResponseOf(topic))
    await this.postCommentClient.connect()
  }

  async onModuleDestroy() {
    await this.postCommentClient.close()
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Post('createComment')
  createComment(@Body() body: CreateCommentDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('createComment', { ...body, accessToken }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }

  @Get('getAllComments/:id')
  getAllComments(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    this.postCommentClient.send('getAllComments', { postId: id }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Delete('deleteComment')
  deleteMyComment(@Body() body: DeleteCommentDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('deleteMyComment', { accessToken, ...body }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Delete('deleteCommentAdmin')
  deleteCommentAdmin(@Body() body: DeleteCommentDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('deleteCommentAdmin', { accessToken, ...body }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }
}
