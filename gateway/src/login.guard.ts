import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs';

@Injectable()
export class IsLoginUserGuard implements CanActivate {
	constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization']; 


    if (authHeader) {
      const jwtToken = authHeader.split(' ')[1]

      if (!jwtToken) {
        return true
      }
      
      const isValidJwt = this.jwtService.verify(jwtToken, {
        ignoreExpiration: false,
        secret: this.configService.get('SECRET_KEY')
      })

      if (isValidJwt) {
        throw new UnauthorizedException('User is already logged in')
      }
    }
    
    return true;
  }
}