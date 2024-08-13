/* eslint-disable indent */
import { IsJWT, IsNumber, IsPositive, IsString, Max, Min } from 'class-validator'

export class CreateCommentDto {
  @IsNumber()
  postId: number

  @IsString()
  @Min(1)
  @Max(100)
  text: string
}

export class DeleteCommentDto {
  @IsNumber()
  @IsPositive()
  commentId: number
}
