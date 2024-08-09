import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { DeleteCommentDto } from 'src/dto/commentDto'
import { CreatePostDto, DeletePostDto } from 'src/dto/postDto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class PostService {
	constructor(
		private readonly jwtService: JwtService,
		private prisma: PrismaService,
	) {}

	async createPost(createPostDto: CreatePostDto) {
		const dataJwt = this.jwtService.decode(createPostDto.accessToken)
		const newPost = this.prisma.createPost(dataJwt.id, createPostDto.text)

		return {
			statusCode: 201,
			data: newPost
		}
	}

	async getAllPost() {
		const data = await this.prisma.getAllPost()
		return {
			statusCode: 200,
			data 
		}
	}
	
	// TODO: Реализовать удаление своих постов и комментариев

	// TODO: Реализовать действия админа
	async postDeleteAdmin(deletePostDto: DeletePostDto) {
		const dataJwt = this.jwtService.decode(deletePostDto.accessToken)

		if (dataJwt.role === "ADMIN") {
			const deletedPost = await this.prisma.deletePostAdmin(deletePostDto.postId)

			return {
				statisCode: 200,
				data: {
					postId: deletedPost.id,
					message: deletedPost.message
				}
			}
		}
		throw new BadRequestException('User is not admin')
	}

	async deleteCommentAdmin(deleteCommentDto: DeleteCommentDto) {
		const dataJwt = this.jwtService.decode(deleteCommentDto.accessToken)

		if (dataJwt.role === "ADMIN") {
			const deletedComment = await this.prisma.deletePostAdmin(deleteCommentDto.commentId)

			return {
				statisCode: 200,
				data: {
					postId: deletedComment.id,
					text: deletedComment.message
				}
			}
		}
		throw new BadRequestException('User is not admin')
	}
}

