import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements      OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  logger = new Logger('Post_service')
  async createPost(userId: number, text: string) {
    const createdPost = await this.post.create({
      data: {
        userId,
        message: text
      }
    })
    .catch((e) => {
      this.logger.error(e)
			throw new InternalServerErrorException(`failed to create a post`)
    })

    return createdPost
  }

  async createComment(userId: number, postId: number, text: string) {
    const createdComment = await this.comments.create({
			data: {
				userId,
				postId,
				text
			},
			include: {
				post: {
					include: {
						Likes: true,
						Comments: true
					}
				}
			}
    })
    .catch((e) => {
			this.logger.error(e)
			throw new InternalServerErrorException(`failed to create a comment to post with id ${postId}`)
		})

    return createdComment
  }

  async createLike(userId: number, postId: number) {
    const like = await this.likes.create({
      data: {
        userId,
        postId
      },
      include: {
        post: {
          include: {
						Likes: true,
						Comments: true
					}
        }
      }
    })
    .catch((e) => {
			this.logger.error(e)
			throw new InternalServerErrorException(`failed to like post with id ${postId}`)
		})

    return like
  }

  async findPostWithLike(userId: number, postId: number) {
    const findPostWithLike = await this.post.findUnique({
      where: {
        id: postId
      },
      include: {
				Likes: {
					where: {
						userId: userId
					}
				}
			}
    })
    .catch((e) => {
			this.logger.error(e)
			throw new InternalServerErrorException(`failed to dislike post with id ${postId}`)
		})

    return findPostWithLike
  }

  async deleteLike(likeId: number) {
    const deleteLike = await this.likes.delete({
      where: {
        id: likeId
      }
    })
    .catch((e) => {
      this.logger.error(e)
      throw new InternalServerErrorException(`failed to dislike post`)
    })

    return deleteLike
  }

  async statisticPost(postId) {
    const statisticPost = await this.post.findUnique({
      where: {
        id: postId
      },
      include: {
        Likes: true,
        Comments: true
      }
    })
    .catch((e) => {
      this.logger.error(e)
      throw new InternalServerErrorException(`failed to dislike post with id ${postId}`)
    })

    return statisticPost
  }

  async deleteAndStatisticPost(likeId: number, postId: number) {
    await this.deleteLike(likeId)
    const statistic = await this.statisticPost(postId)

    return {
      likeCount: statistic.Likes.length,
      commentCount: statistic.Comments.length
    }
  }

  async deletePostAdmin(postId: number) {
    const postDeleted = await this.post.delete({
      where: {
        id: postId
      }
    })
    .catch((e) => {
      this.logger.error(e)
      throw new InternalServerErrorException(`failed to delete post with id ${postId}`)
    })

    return postDeleted
  }

  async getAllPost() {
    return await this.post.findMany()
    .catch(e => {
      this.logger.error(e)
      throw new InternalServerErrorException(`failed to get all post`)
    })
  }

  async getAllComments(postId: number) {
    const allComments = await this.comments.findMany({
      where: {
        postId
      }
    })
    .catch(e => {
      this.logger.error(e)
      throw new InternalServerErrorException(`failed to get all comments from post with id ${postId}`)
    })

    return allComments
  }
}