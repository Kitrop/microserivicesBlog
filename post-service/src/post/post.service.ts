import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { DeleteCommentDto } from 'src/dto/comment.dto'
import { CreatePostDto, DeletePostDto, GetPostsDto } from 'src/dto/post.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class PostService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const dataJwt = this.jwtService.decode(createPostDto.accessToken)
    const newPost = await this.prisma.createPost(dataJwt.id, createPostDto.text)
    return {
      statisCode: HttpStatus.CREATED,
      data: newPost,
    }
  }

  async getPosts(getPostsDto: GetPostsDto) {
    const data = await this.prisma.getAllPost(getPostsDto.page, getPostsDto.chunk)

    return {
      statisCode: HttpStatus.OK,
      data: {
        posts: data,
        page: getPostsDto.page,
        chunk: getPostsDto.chunk,
      },
    }
  }

  async postDeleteAdmin(deletePostDto: DeletePostDto) {
    const dataJwt = this.jwtService.decode(deletePostDto.accessToken)

    if (dataJwt.role === 'ADMIN') {
      await this.prisma.deletePost(deletePostDto.postId)

      return {
        statisCode: HttpStatus.OK,
        data: {
          postId: deletePostDto.postId,
        },
      }
    }
    throw new BadRequestException('User is not admin')
  }

  async deleteCommentAdmin(deleteCommentDto: DeleteCommentDto) {
    const dataJwt = this.jwtService.decode(deleteCommentDto.accessToken)

    if (dataJwt.role === 'ADMIN') {
      await this.prisma.deleteComment(deleteCommentDto.commentId)

      return {
        statisCode: HttpStatus.OK,
        data: {
          postId: deleteCommentDto.commentId,
        },
      }
    }
    throw new BadRequestException('User is not admin')
  }

  async deleteMyPost(deletePost: DeletePostDto) {
    const dataJwt = this.jwtService.decode(deletePost.accessToken)
    const userId = await this.prisma.findAuthorIdPost(deletePost.postId)

    if (userId === dataJwt.id) {
      this.prisma.deletePost(deletePost.postId)
      return {
        statusCode: HttpStatus.NO_CONTENT,
        data: {
          postId: deletePost.postId,
          userId: dataJwt.id,
        },
      }
    } else {
      throw new BadRequestException('user is not author of this post')
    }
  }

  async deletePostAdmin(deletePost: DeletePostDto) {
    const dataJwt = this.jwtService.decode(deletePost.accessToken)

    if (dataJwt.role === 'ADMIN') {
      this.prisma.deletePost(deletePost.postId)
      return {
        statusCode: HttpStatus.NO_CONTENT,
        data: {
          postId: deletePost.postId,
        },
      }
    } else {
      throw new BadRequestException('user is not admin')
    }
  }
}
