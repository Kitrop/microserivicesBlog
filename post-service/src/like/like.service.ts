import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LikePostDto } from 'src/dto/like.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LikeService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async likePost(likePostDto: LikePostDto) {
    const dataJwt = this.jwtService.decode(likePostDto.accessToken);

    if (!this.prisma.findPost(likePostDto.postId)) {
      throw new NotFoundException('Post not found');
    }

    // Поиск по лайкам пользователя по этому посту
    const findPostWithLike = await this.prisma.findPostWithLike(dataJwt.id, likePostDto.postId);

    // Если лайк уже стоит
    if (findPostWithLike.Likes.length !== 0) {
      // Убрать лайк
      const staticst = await this.prisma.deleteAndStatisticPost(findPostWithLike.Likes[0].id, likePostDto.postId);

      return {
        statusCode: HttpStatus.OK,
        data: {
          postId: likePostDto.postId,
          like: false,
          likes: staticst.likeCount,
          comments: staticst.commentCount,
        },
      };
    }

    // Пользователь поставил лайк
    const newLike = await this.prisma.createLike(dataJwt.id, likePostDto.postId);

    return {
      statusCode: HttpStatus.OK,
      data: {
        postId: newLike.postId,
        like: true,
        likes: newLike.likeCount,
        comments: newLike.commentsCount,
      },
    };
  }
}
