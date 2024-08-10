import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { DeleteCommentDto } from 'src/dto/commentDto'
import { CreatePostDto, DeletePostDto, GetPostsDto } from 'src/dto/postDto'
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
			statisCode: HttpStatus.CREATED,
			data: newPost
		}
	}

	async getPosts(getPostsDto: GetPostsDto) {
		const data = await this.prisma.post.findMany({
			skip: (getPostsDto.page - 1) * getPostsDto.chunk,
			take: getPostsDto.chunk
		}) 
		return {
			statisCode: HttpStatus.OK,
			data: {
				posts: data,
				page: getPostsDto.page,
				chunk: getPostsDto.chunk
			} 
		}
	}
	
	// TODO: Реализовать удаление своих постов и комментариев
	// TODO: Реализовать действия админа
	async postDeleteAdmin(deletePostDto: DeletePostDto) {
		const dataJwt = this.jwtService.decode(deletePostDto.accessToken)

		if (dataJwt.role === "ADMIN") {
			const deletedPost = await this.prisma.deletePostAdmin(deletePostDto.postId)

			return {
				statisCode: HttpStatus.OK,
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
				statisCode: HttpStatus.OK,
				data: {
					postId: deletedComment.id,
					text: deletedComment.message
				}
			}
		}
		throw new BadRequestException('User is not admin')
	}
}

