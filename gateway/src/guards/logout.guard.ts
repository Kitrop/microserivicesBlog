import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'

@Injectable()
export class CheckIsLoginUserGuard implements CanActivate {
  // Проверка на то что пользователь залогинен
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const accessToken = request.cookies['accessToken']

    if (!accessToken) {
      throw new BadRequestException('User is not logged in')
    }

    const isValidToken = this.jwtService
      .verifyAsync(accessToken, {
        ignoreExpiration: false,
        secret: this.configService.get('SECRET_KEY'),
      })
      .catch((err) => {
        console.log(err)
        throw new BadRequestException('Invalid token')
      })

    return isValidToken ? true : false
  }
}
