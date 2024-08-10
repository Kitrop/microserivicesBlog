import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PostService } from './post.service'
import { CreatePostDto, GetPostsDto } from 'src/dto/postDto'

@Controller('post')
export class PostController {
	constructor(private postService: PostService) {}

	@MessagePattern('createPost')
	async createPost(@Payload() createPost: CreatePostDto) {
		return this.postService.createPost(createPost)
	}

	@MessagePattern('getAllPost')
	async getPosts(@Payload() getPostsDto: GetPostsDto) {
		return this.postService.getPosts(getPostsDto)
	}
}
