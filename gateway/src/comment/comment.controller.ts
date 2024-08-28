import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AdminDeleteCommentResponseApi, CreatePostResponseApi, DeleteCommentResponseApi, GetAllPostResponseApi } from '../decorators/comment.decorator';
import { CreateCommentDto, DeleteCommentDto } from '../dto/comment.dto';
import { AdminGuard } from '../guards/admin.guard';
import { CheckIsLoginUserGuard } from '../guards/logout.guard';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('COMMENTS')
@Controller('comment')
export class CommentController {
  constructor(
    @Inject('POST_COMMENT_SERVICE')
    private postCommentClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const topics = ['createComment', 'getAllComments', 'deleteMyComment', 'deleteCommentAdmin'];
    topics.forEach((topic) => this.postCommentClient.subscribeToResponseOf(topic));
    await this.postCommentClient.connect();
  }

  async onModuleDestroy() {
    await this.postCommentClient.close();
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Post('createComment')
  @CreatePostResponseApi()
  createComment(@Body() body: CreateCommentDto, @Res() res: Response, @Req() req: Request) {
    const messageId = uuidv4();
    console.log('createComment');
    const accessToken = req.cookies['accessToken'];
    this.postCommentClient.send('createComment', { ...body, accessToken, messageId }).subscribe((result) => {
      res.send(result).status(result.statusCode);
    });
  }

  @Get('getAllComments/:id')
  @GetAllPostResponseApi()
  getAllComments(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const messageId = uuidv4();
    this.postCommentClient.send('getAllComments', { postId: id, messageId }).subscribe((result) => {
      res.send(result).status(result.statusCode);
    });
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Delete('deleteComment')
  @DeleteCommentResponseApi()
  deleteMyComment(@Body() body: DeleteCommentDto, @Res() res: Response, @Req() req: Request) {
    const messageId = uuidv4();
    const accessToken = req.cookies['accessToken'];
    this.postCommentClient.send('deleteMyComment', { accessToken, ...body, messageId }).subscribe((result) => {
      res.send(result).status(result.statusCode);
    });
  }

  @UseGuards(AdminGuard)
  @Delete('deleteCommentAdmin')
  @AdminDeleteCommentResponseApi()
  deleteCommentAdmin(@Body() body: DeleteCommentDto, @Res() res: Response, @Req() req: Request) {
    const messageId = uuidv4();
    const accessToken = req.cookies['accessToken'];
    this.postCommentClient.send('deleteCommentAdmin', { accessToken, ...body, messageId }).subscribe((result) => {
      res.send(result).status(result.statusCode);
    });
  }
}
