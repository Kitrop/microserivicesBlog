import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { GetPostsDto } from './dto/post.dto'

@Controller()
export class AppController {
  constructor() {}

  @MessagePattern('new')
  news() {
    console.log('asd')
    return 'ok!'
  }
}
