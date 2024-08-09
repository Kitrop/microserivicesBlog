import { IsJWT, IsNumber, IsPositive, IsString } from 'class-validator'

export class DeletePostDto{
	@IsString()
	@IsJWT()
	accessToken: string

	@IsNumber()
	@IsPositive()
	postId: number
}