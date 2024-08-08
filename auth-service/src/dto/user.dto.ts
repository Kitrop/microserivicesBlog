import { IsEmail, isString, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class UserCreateDto {
	@IsEmail()
	@IsString()
	email: string

	@IsString()
	@MinLength(3)
	@MaxLength(20)
	username: string

	@IsString()
	@MinLength(8, { message: 'minimum password length is 8 characters'})
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password must contain uppercase, lowercase, number and special character',
  })
	password: string

	@IsString()
	messageId: string
}

export class LoginDto {
	@IsString()
	@MinLength(8)
	@MaxLength(20)
	username: string

	@IsString()
	password: string

	@IsString()
	messageId: string
}