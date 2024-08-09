import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor() {}

  @MessagePattern('post_topic')
  handleServiceBEvent(data: any) {
    return { message: 'Response from POST_SERVICE', data };
  }
}
