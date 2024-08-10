import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePostDto, GetPostsDto } from 'src/dto/post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @MessagePattern('createPost')
  async createPost(@Payload() createPost: CreatePostDto) {
    return this.postService.createPost(createPost);
  }

  @MessagePattern('getAllPost')
  async getPosts(@Payload() getPostsDto: GetPostsDto) {
    return this.postService.getPosts(getPostsDto);
  }
}
