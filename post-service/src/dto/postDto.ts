import { IsJWT, IsNumber, IsPositive, IsString, Max, Min } from 'class-validator'

export class CreatePostDto {
	@IsString()
	accessToken: string

	@IsString()
	@Min(4)
	@Max(350)
	text: string
}

export class DeletePostDto{
	@IsString()
	@IsJWT()
	accessToken: string

	@IsNumber()
	@IsPositive()
	postId: number
}