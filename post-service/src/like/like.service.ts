import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LikePostDto } from 'src/dto/likeDto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class LikeService {
	constructor(
		private readonly jwtService: JwtService,
		private prisma: PrismaService,
	) {}


	async likePost(likePostDto: LikePostDto) {
		const dataJwt = this.jwtService.decode(likePostDto.accessToken)

		if(!this.prisma.findPost(likePostDto.postId)) {
			throw new NotFoundException('Post not found')
		}

		const findPostWithLike = await this.prisma.findPostWithLike(dataJwt.id, likePostDto.postId)

		if (findPostWithLike) {
			const staticst = await this.prisma.deleteAndStatisticPost(findPostWithLike.Likes[0].id, likePostDto.postId)

			return {
				statusCode: 204,
				data: {
					postId: likePostDto.postId,
					like: false,
					likes: staticst.likeCount,
					comments: staticst.likeCount,
				}
			}
		}

		const newLike = await this.prisma.createLike(dataJwt.id, likePostDto.postId)

		return {
			statusCode: 201,
			data: {
				postId: newLike.id,
				like: true,
				likes: newLike.post.Likes.length,
				comments: newLike.post.Comments.length,
			}
		}
	}

}