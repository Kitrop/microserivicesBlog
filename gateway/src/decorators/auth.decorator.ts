import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { SignInDto, SignUpDto } from 'src/dto/auth.dto';
import { ReturnedAuthDto } from 'src/dto/returnDto/r_auth.dto';

export function SingUpResponseApi() {
  return applyDecorators(ApiBody({ type: SignUpDto }), ApiResponse({ status: HttpStatus.OK, description: 'user success create', type: ReturnedAuthDto }), ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'user with this username already exist' }), ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'user with this email already exist' }));
}

export function SingInResponseApi() {
  return applyDecorators(ApiBody({ type: SignInDto }), ApiResponse({ status: HttpStatus.OK, description: 'user success login', type: ReturnedAuthDto }), ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'input password incorrect' }), ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'user with this username not found' }));
}
