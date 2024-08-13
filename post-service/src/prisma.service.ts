import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  logger = new Logger('Post_service')
  async createPost(userId: number, text: string) {
    const createdPost = await this.post
      .create({
        data: {
          userId,
          message: text,
        },
      })
      .catch((e) => {
        this.logger.error(e)
        throw new InternalServerErrorException('failed to create a post')
      })
    console.log(createdPost)
    return createdPost
  }

  async createComment(
    userId: number,
    username: string,
    postId: number,
    text: string,
  ) {
    const createdComment = await this.comments
      .create({
        data: {
          userId,
          username,
          postId,
          text,
        },
      })
      .catch((e) => {
        this.logger.error(e)
        throw new InternalServerErrorException(
          `failed to create a comment to post with id ${postId}`,
        )
      })

    const likeCount = await this.likes.count({
      where: {
        postId,
      },
    })

    const commentsCount = await this.likes.count({
      where: {
        postId,
      },
    })

    return {
      commentId: createdComment.id,
      text: createdComment.text,
      commentsCount,
      likeCount,
    }
  }

  async createLike(userId: number, postId: number) {
    const like = await this.likes
      .create({
        data: {
          userId,
          postId,
        },
      })
      .catch((e) => {
        this.logger.error(e)
        throw new InternalServerErrorException(
          `failed to like post with id ${postId}`,
        )
      })

    const likeCount = await this.likes.count({
      where: {
        postId,
      },
    })

    const commentsCount = await this.likes.count({
      where: {
        postId,
      },
    })

    return {
      postId,
      likeCount,
      commentsCount,
    }
  }

  async findPostWithLike(userId: number, postId: number) {
    const findPostWithLike = await this.post
      .findUnique({
        where: {
          id: postId,
        },
        include: {
          Likes: {
            where: {
              userId: userId,
            },
          },
        },
      })
      .catch((e) => {
        this.logger.error(e)
        throw new InternalServerErrorException(
          `failed to dislike post with id ${postId}`,
        )
      })

    return findPostWithLike
  }

  async deleteLike(likeId: number) {
    const deleteLike = await this.likes
      .delete({
        where: {
          id: likeId,
        },
      })
      .catch((e) => {
        this.logger.error(e)
        throw new InternalServerErrorException('failed to dislike post')
      })

    return deleteLike
  }

  async statisticPost(postId) {
    const likes = await this.likes.count({
      where: {
        postId,
      },
    })
    const comments = await this.comments
      .count({
        where: {
          postId,
        },
      })

      .catch((e) => {
        this.logger.error(e)
        throw new InternalServerErrorException(
          `failed to dislike post with id ${postId}`,
        )
      })

    return {
      comments,
      likes,
    }
  }

  async deleteAndStatisticPost(likeId: number, postId: number) {
    await this.deleteLike(likeId)
    const statistic = await this.statisticPost(postId)

    return {
      likeCount: statistic.likes,
      commentCount: statistic.comments,
    }
  }

  async deleteCommentAdmin(commentId: number) {
    const deletedComment = await this.comments
      .delete({
        where: {
          id: commentId,
        },
      })
      .catch((e) => {
        this.logger.error(e)
        throw new InternalServerErrorException(
          `failed to delete comment with id ${commentId}`,
        )
      })

    return deletedComment
  }

  async getAllPost() {
    return await this.post.findMany().catch((e) => {
      this.logger.error(e)
      throw new InternalServerErrorException('failed to get all post')
    })
  }

  async getAllComments(postId: number) {
    const allComments = await this.comments
      .findMany({
        where: {
          postId,
        },
      })
      .catch((e) => {
        this.logger.error(e)
        throw new InternalServerErrorException(
          `failed to get all comments from post with id ${postId}`,
        )
      })

    return allComments
  }

  async findPost(id: number): Promise<boolean> {
    const findPost = this.post.findUnique({
      where: {
        id,
      },
    })

    return findPost ? true : false
  }

  async findAuthorIdPost(postId: number) {
    const findPost = await this.post.findUnique({
      where: {
        id: postId,
      },
    })

    if (!findPost) {
      throw new NotFoundException('post not found')
    }

    return findPost.userId
  }

  async deletePost(postId: number) {
    const isFindPost = this.findPost(postId)

    if (!isFindPost) {
      throw new NotFoundException('post with this id not found')
    }

    this.post
      .delete({
        where: {
          id: postId,
        },
      })
      .catch((e) => {
        this.logger.error(e)
        throw new InternalServerErrorException(
          `failed to delete post with id ${postId}`,
        )
      })

    this.comments
      .deleteMany({
        where: {
          postId,
        },
      })
      .catch((e) => {
        this.logger.error(e)
        throw new InternalServerErrorException(
          `failed to delete all comments from post with id ${postId}`,
        )
      })
  }

  async findComment(commentId: number) {
    const comment = this.comments.findUnique({
      where: {
        id: commentId,
      },
    })

    return comment ? true : false
  }

  async findAuthorIdComment(commentId: number) {
    const findComment = await this.comments.findUnique({
      where: {
        id: commentId,
      },
    })

    if (!findComment) {
      throw new NotFoundException('post not found')
    }

    return findComment.userId
  }

  async deleteComment(commentId: number) {
    const isFindComment = this.findComment(commentId)

    if (!isFindComment) {
      throw new NotFoundException('Comment with this id not found')
    }

    this.comments
      .delete({
        where: {
          id: commentId,
        },
      })
      .catch((e) => {
        this.logger.error(e)
        throw new InternalServerErrorException(
          `failed to delete comment with id ${commentId}`,
        )
      })
  }
}
