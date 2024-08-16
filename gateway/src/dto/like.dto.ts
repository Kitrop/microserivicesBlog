/* eslint-disable indent */
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber } from 'class-validator'

export class LikePostDto {
  @IsNumber()
  @ApiProperty()
  postId: number
}
