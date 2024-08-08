import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service'
import { LoginDto, UserCreateDto } from './dto/user.dto'

@Controller()
export class AppController {
  private processedMessages = new Set()
  private processedMessagesLogin = new Set()

  constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

  logger = new Logger(AppController.name)

  @MessagePattern('my-first-topic')
  handleServiceAEvent(data: any) {
    return { message: 'Response from AUTH_SERVICE', data }
  }

  @MessagePattern('signUp')
  signUp(@Payload() signUpDto: UserCreateDto) {
    const messageId = signUpDto.messageId
    if (!this.processedMessages.has(messageId)) {
      this.logger.log('Message add to memory')
      this.processedMessages.add(messageId);
    } else {
      this.logger.log('Message duplicate')
      return this.authService.createUser(signUpDto);
    }
  }

  @MessagePattern('signIn')
  signIn(@Payload() loginDto: LoginDto) {
    const messageId = loginDto.messageId
    this.logger.log('Pattern signin')
    if (!this.processedMessagesLogin.has(messageId)) {
      this.logger.log('Message add to memory')
      this.processedMessagesLogin.add(messageId);
    } else {
      this.logger.log('Message duplicate')
      return this.authService.signIn(loginDto)
    }
  }
}
