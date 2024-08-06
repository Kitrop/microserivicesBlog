import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service'
import { LoginDto, UserCreateDto } from './dto/user.dto'

@Controller()
export class AppController {
  private processedMessages = new Set();

  constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

  @MessagePattern('my-first-topic') // Our topic name
  handleServiceAEvent(data: any) {
    return { message: 'Response from AUTH_SERVICE', data };
  }

  @MessagePattern('signUp')
  signUp(signUpDto: UserCreateDto) {
    const messageId = signUpDto.messageId;
    console.log(signUpDto)
    if (!this.processedMessages.has(messageId)) {
      console.log("Duplicate message received, ignoring", messageId);
      this.processedMessages.add(messageId);
    } else {
      console.log("Processing new signUp message with ID:", messageId);
      return this.authService.createUser(signUpDto);
    }
  }

  @MessagePattern('signIn')
  signIn(loginDto: LoginDto) {
    return this.authService.signIn(loginDto)
  }
  
}
