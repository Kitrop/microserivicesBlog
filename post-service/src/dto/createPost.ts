import { IsJWT, IsNumber, IsString, Max, Min } from 'class-validator'


export class CreatePostDto {
	@IsString()
	accessToken: string

	@IsString()
	@Min(4)
	@Max(350)
	text: string
}

export class CreateCommentDto {
	@IsNumber()
	postId: number

	@IsString()
	@IsJWT()
	accessToken: string

	@IsString()
	@Min(1)
	@Max(100)
	text: string
}

export class LikePostDto {
	@IsNumber()
	postId: number

	@IsString()
	@IsJWT()
	accessToken: string
}