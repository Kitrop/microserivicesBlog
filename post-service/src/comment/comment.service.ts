import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateCommentDto, GetAllCommentsDto } from 'src/dto/commentDto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class CommentService {
	constructor(
		private readonly jwtService: JwtService,
		private prisma: PrismaService,
	) {}

	async createComment(createCommentDto: CreateCommentDto) {
		const dataJwt = this.jwtService.decode(createCommentDto.accessToken)

		if(!this.prisma.findPost(createCommentDto.postId)) {
			throw new NotFoundException('Post not found')
		}

		const newComment = await this.prisma.createComment(dataJwt.id, createCommentDto.postId, createCommentDto.text)

		return {
			statusCode: 201,
			data: {
				commentId: newComment.id,
				text: newComment.text,
				likes: newComment.post.Likes.length,
				comments: newComment.post.Comments,
			}
		}
	}

	async getAllComments(getAllComments: GetAllCommentsDto) {
		const data = await this.prisma.getAllComments(getAllComments.postId)
		return {
			statusCode: 200,
			data
		}
	}
}