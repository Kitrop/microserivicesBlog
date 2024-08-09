import { Controller } from '@nestjs/common';
import { LikeService } from './like.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { LikePostDto } from '../dto/likeDto';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @MessagePattern('like')
  async likePost(@Payload() likePost: LikePostDto) {
    return this.likeService.likePost(likePost)
  }
}
