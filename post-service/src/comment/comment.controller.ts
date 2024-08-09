import { Controller } from '@nestjs/common';
import { CommentService } from './comment.service';
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateCommentDto, GetAllCommentsDto } from 'src/dto/commentDto'

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
}
