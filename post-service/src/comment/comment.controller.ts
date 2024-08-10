import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCommentDto, GetAllCommentsDto } from 'src/dto/comment.dto';
import { CommentService } from './comment.service';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @MessagePattern('createComment')
  async createComment(@Payload() createComment: CreateCommentDto) {
    return this.commentService.createComment(createComment);
  }

  @MessagePattern('getAllComments')
  async getAllComments(@Payload() getAllComments: GetAllCommentsDto) {
    return this.commentService.getAllComments(getAllComments);
  }
}
