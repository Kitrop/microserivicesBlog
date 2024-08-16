/* eslint-disable indent */
import { IsJWT, IsNumber, IsPositive, IsString, Max, Min } from 'class-validator'

export class GetAllCommentsDto {
  @IsNumber()
  @IsPositive()
  postId: number
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

export class DeleteCommentDto {
  @IsString()
  @IsJWT()
  accessToken: string

  @IsNumber()
  @IsPositive()
  commentId: number
}
