import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PostService } from './post.service'
import { CreatePostDto } from 'src/dto/postDto'

@Controller('post')
export class PostController {
	constructor(private postService: PostService) {}

	@MessagePattern('createPost')
	async createPost(@Payload() createPost: CreatePostDto) {
		return this.postService.createPost(createPost)
	}

	@MessagePattern('getAllPost')
	async getAllPost() {
		return this.postService.getAllPost()
	}
}
