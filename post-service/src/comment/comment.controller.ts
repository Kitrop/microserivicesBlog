import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
  CreateCommentDto,
  DeleteCommentDto,
  GetAllCommentsDto,
} from 'src/dto/comment.dto'
import { CommentService } from './comment.service'

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @MessagePattern('createComment')
  async createComment(@Payload() createComment: CreateCommentDto) {
    return this.commentService.createComment(createComment)
  }

  @MessagePattern('getAllComments')
  async getAllComments(@Payload() getAllComments: GetAllCommentsDto) {
    return this.commentService.getAllComments(getAllComments)
  }

  @MessagePattern('deleteMyComment')
  async deleteMyComment(@Payload() deletePost: DeleteCommentDto) {
    return this.commentService.deleteMyComment(deletePost)
  }

  @MessagePattern('deleteCommentAdmin')
  async deleteCommentAdmin(@Payload() deletePost: DeleteCommentDto) {
    return this.commentService.deleteCommentAdmin(deletePost)
  }
}
