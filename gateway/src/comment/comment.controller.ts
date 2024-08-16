import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, ParseIntPipe, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'
import { Request, Response } from 'express'
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateCommentDto, DeleteCommentDto } from 'src/dto/comment.dto'
import { ReturnedCreateComment, ReturnedDeleteAdminComment, ReturnedDeleteComment, ReturnedGetAllComments } from 'src/dto/returnDto/r_comment.dto'

@ApiTags('COMMENTS')
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
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'create comment to post', type: ReturnedCreateComment })
  createComment(@Body() body: CreateCommentDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('createComment', { ...body, accessToken }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }

  @Get('getAllComments/:id')
  @ApiResponse({ status: HttpStatus.OK, description: 'get all comments from post', type: ReturnedGetAllComments })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'post not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'post id' })
  getAllComments(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    this.postCommentClient.send('getAllComments', { postId: id }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Delete('deleteComment')
  @ApiBody({ type: DeleteCommentDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'delete comment from post', type: ReturnedDeleteComment })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'user not is author of this comment' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'comment not found' })
  deleteMyComment(@Body() body: DeleteCommentDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('deleteMyComment', { accessToken, ...body }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Delete('deleteCommentAdmin')
  @ApiBody({ type: DeleteCommentDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'delete comment from post', type: ReturnedDeleteAdminComment })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'user not admin' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'comment not found' })
  deleteCommentAdmin(@Body() body: DeleteCommentDto, @Res() res: Response, @Req() req: Request) {
    const accessToken = req.cookies['accessToken']
    this.postCommentClient.send('deleteCommentAdmin', { accessToken, ...body }).subscribe((result) => {
      res.send(result).status(result.statusCode)
    })
  }
}
