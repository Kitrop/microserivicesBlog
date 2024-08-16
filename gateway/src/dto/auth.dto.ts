/* eslint-disable indent */
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class SignInDto {
  @IsString()
  @ApiProperty()
  username: string

  @IsString()
  @ApiProperty()
  password: string
}

export class SignUpDto {
  @IsEmail()
  @IsString()
  @ApiProperty()
  email: string

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  username: string

  @IsString()
  @MinLength(8, {
    message: 'minimum password length is 8 characters',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password must contain uppercase, lowercase, number and special character',
  })
  @ApiProperty()
  password: string
}
