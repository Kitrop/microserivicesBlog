import { IsNumber, IsPositive } from 'class-validator'

export class GetAllCommentsDto {
	@IsNumber()
	@IsPositive()
	postId: number
}