import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { CreateCommentDto, CreatePostDto, LikePostDto } from 'src/dto/createPost'
import { PrismaService } from 'src/prisma.service'
import { DeletePostDto } from '../dto/deletePost';
import { GetAllCommentsDto } from 'src/dto/getAll'

@Injectable()
export class PostService {
	constructor(
		private readonly jwtService: JwtService,
		private prisma: PrismaService,
	) {}

	logger = new Logger()

	async createPost(createPostDto: CreatePostDto) {
		const dataJwt = this.jwtService.decode(createPostDto.accessToken)

		const newPost = this.prisma.createPost(dataJwt.id, createPostDto.text)
	}

	async createComment(createCommentDto: CreateCommentDto) {
		const dataJwt = this.jwtService.decode(createCommentDto.accessToken)

		if(!this.findPost(createCommentDto.postId)) {
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

	async likePost(likePostDto: LikePostDto) {
		const dataJwt = this.jwtService.decode(likePostDto.accessToken)

		if(!this.findPost(likePostDto.postId)) {
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

	async findPost(id: number): Promise<boolean> {
		const findPost = this.prisma.post.findUnique({
			where: {
				id
			}
		})

		return findPost ? true : false 
	}

	async postDelete(deletePostDto: DeletePostDto) {
		const dataJwt = this.jwtService.decode(deletePostDto.accessToken)

		if (dataJwt.role === "ADMIN") {
			const deletedPost = await this.prisma.deletePostAdmin(deletePostDto.postId)

			return {
				statisCode: 200,
				data: {
					postId: deletedPost.id,
				}
			}
		}
		throw new BadRequestException('User is not admin')
	}

	async getAllPost() {
		return this.prisma.getAllPost()
	}

	async getAllComments(getAllComments: GetAllCommentsDto) {
		return this.prisma.getAllComments(getAllComments.postId)
	}
}

