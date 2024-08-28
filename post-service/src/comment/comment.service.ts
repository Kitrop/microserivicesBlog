import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateCommentDto, DeleteCommentDto, GetAllCommentsDto } from 'src/dto/comment.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const dataJwt = this.jwtService.decode(createCommentDto.accessToken);

    if (!this.prisma.findPost(createCommentDto.postId)) {
      throw new NotFoundException('Post not found');
    }

    const newComment = await this.prisma.createComment(dataJwt.id, dataJwt.username, createCommentDto.postId, createCommentDto.text);

    return {
      statusCode: HttpStatus.CREATED,
      data: {
        commentId: newComment.commentId,
        text: newComment.text,
        likes: newComment.likeCount,
        comments: newComment.commentsCount,
      },
    };
  }

  async getAllComments(getAllComments: GetAllCommentsDto) {
    const data = await this.prisma.getAllComments(getAllComments.postId);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  async deleteMyComment(deleteComment: DeleteCommentDto) {
    const dataJwt = this.jwtService.decode(deleteComment.accessToken);
    const userId = await this.prisma.findAuthorIdComment(deleteComment.commentId);

    if (dataJwt.id === userId) {
      this.prisma.deleteComment(deleteComment.commentId);

      return {
        statusCode: HttpStatus.NO_CONTENT,
        data: {
          commentId: deleteComment.commentId,
          userId,
        },
      };
    } else {
      throw new BadRequestException('user is not author of this comment');
    }
  }

  async deleteCommentAdmin(deleteComment: DeleteCommentDto) {
    const dataJwt = this.jwtService.decode(deleteComment.accessToken);

    if (dataJwt.role === 'ADMIN') {
      this.prisma.deleteComment(deleteComment.commentId);

      return {
        statusCode: HttpStatus.NO_CONTENT,
        data: {
          commentId: deleteComment.commentId,
        },
      };
    } else {
      throw new BadRequestException('user is not admin');
    }
  }
}
