/* eslint-disable indent */
import { IsJWT, IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @MinLength(2)
  @MaxLength(350)
  text: string
}

export class DeletePostDto {
  @IsString()
  @IsJWT()
  accessToken: string

  @IsNumber()
  @IsPositive()
  postId: number
}

export class GetPostsDto {
  @IsNumber()
  @IsPositive()
  page: number

  @IsNumber()
  @IsPositive()
  chunk: number
}
