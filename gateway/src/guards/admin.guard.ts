import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'

@Injectable()
export class AdminGuard implements CanActivate {
  // Проверка на то что пользователь админ
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const accessToken = request.cookies['accessToken']

    if (!accessToken) {
      throw new UnauthorizedException('User is not logged in')
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

    if (!isValidToken) {
      throw new BadRequestException('Invalid token')
    }

    const dataJwt = this.jwtService.decode(accessToken)

    if (dataJwt.role === 'ADMIN') {
      return true
    } else {
      throw new BadRequestException('User is not admin')
    }
  }
}
