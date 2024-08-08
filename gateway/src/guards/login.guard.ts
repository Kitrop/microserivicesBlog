import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'

@Injectable()
export class CheckIsLogoutUserGuard implements CanActivate {
  // Проверка на то что пользователь не залогинен
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const accessToken = request.cookies['accessToken']
    if (accessToken) {
      this.jwtService
        .verifyAsync(accessToken, {
          ignoreExpiration: false,
          secret: this.configService.get('SECRET_KEY'),
        })
        .catch((err) => {
          return true
        })
      throw new UnauthorizedException('User is already logged in')
    }
    return true
  }
}
