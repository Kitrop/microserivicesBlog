import { IsJWT, IsNumber, IsString } from 'class-validator'

export class LikePostDto {
	@IsNumber()
	postId: number

	@IsString()
	@IsJWT()
	accessToken: string
}