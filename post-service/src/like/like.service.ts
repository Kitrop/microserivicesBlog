import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
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
				statusCode: HttpStatus.OK,
				data: {
					postId: likePostDto.postId,
					like: false,
					likes: staticst.likeCount,
					comments: staticst.commentCount,
				}
			}
		}

		const newLike = await this.prisma.createLike(dataJwt.id, likePostDto.postId)

		return {
			statusCode: HttpStatus.CREATED,
			data: {
				postId: newLike.postId,
				like: true,
				likes: newLike.likeCount,
				comments: newLike.commentsCount
			}
		}
	}

}