import { Controller, Inject } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreatePostDto, DeletePostDto, GetPostsDto } from 'src/dto/post.dto'
import { PostService } from './post.service'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'

@Controller()
export class PostController {
  constructor(
    private postService: PostService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @MessagePattern('createPost')
  async createPost(@Payload() createPost: CreatePostDto) {
    return this.postService.createPost(createPost)
  }

  @MessagePattern('allPost')
  async allPost(@Payload() allPost: GetPostsDto) {
    const key = 'allPost'
    const value = await this.cacheManager.get(key)

    if (value) {
      return value
    }

    const data = await this.postService.getPosts(allPost)
    if (data.statisCode === 200) {
      await this.cacheManager.set(key, data)
    }

    return data
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
