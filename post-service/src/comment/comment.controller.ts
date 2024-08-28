import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCommentDto, DeleteCommentDto, GetAllCommentsDto } from 'src/dto/comment.dto';
import { CommentService } from './comment.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { LikePostDto } from 'src/dto/like.dto';

@Controller()
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @MessagePattern('createComment')
  async createComment(@Payload() createComment: CreateCommentDto) {
    console.log('comment');
    return this.commentService.createComment(createComment);
  }

  @MessagePattern('getAllComments')
  async getAllComments(@Payload() getAllComments: GetAllCommentsDto) {
    const key = `getAllComments_${getAllComments.postId}`;
    const value = await this.cacheManager.get(key);
    if (value) {
      return value;
    }

    const data = await this.commentService.getAllComments(getAllComments);

    if (data.statusCode === 200) {
      await this.cacheManager.set(key, data);
    }

    return data;
  }

  @MessagePattern('deleteMyComment')
  async deleteMyComment(@Payload() deletePost: DeleteCommentDto) {
    return this.commentService.deleteMyComment(deletePost);
  }

  @MessagePattern('deleteCommentAdmin')
  async deleteCommentAdmin(@Payload() deletePost: DeleteCommentDto) {
    return this.commentService.deleteCommentAdmin(deletePost);
  }
}
