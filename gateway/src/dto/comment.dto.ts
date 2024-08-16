/* eslint-disable indent */
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'
import { IsJWT, IsNumber, IsPositive, IsString, Max, Min } from 'class-validator'

export class CreateCommentDto {
  @IsNumber()
  @ApiProperty()
  postId: number

  @IsString()
  @Min(1)
  @Max(100)
  @ApiProperty()
  text: string
}

export class DeleteCommentDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  commentId: number
}
