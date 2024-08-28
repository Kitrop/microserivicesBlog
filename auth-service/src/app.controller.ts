import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth/auth.service';
import { LoginDto, UserCreateDto } from './dto/user.dto';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  logger = new Logger(AppController.name);

  @MessagePattern('signUp')
  async signUp(@Payload() signUpDto: UserCreateDto) {
    return await this.authService.createUser(signUpDto);
  }

  @MessagePattern('signIn')
  signIn(@Payload() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }
}
