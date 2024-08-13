import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreatePostDto, DeletePostDto, GetPostsDto } from 'src/dto/post.dto'
import { PostService } from './post.service'

@Controller()
export class PostController {
  constructor(private postService: PostService) {}

  @MessagePattern('createPost')
  async createPost(@Payload() createPost: CreatePostDto) {
    return this.postService.createPost(createPost)
  }

  @MessagePattern('allPost')
  async allPost(@Payload() allPost: GetPostsDto) {
    return this.postService.getPosts(allPost)
  }

  @MessagePattern('deleteMyPost')
  async deleteMyPost(@Payload() deletePost: DeletePostDto) {
    return this.postService.deleteMyPost(deletePost)
  }

  @MessagePattern('deletePostAdmin')
  async deletePostAdmin(@Payload() deletePost: DeletePostDto) {
    return this.postService.deletePostAdmin(deletePost)
  }
}
