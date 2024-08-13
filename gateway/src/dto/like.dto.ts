/* eslint-disable indent */
import { IsNumber } from 'class-validator'

export class LikePostDto {
  @IsNumber()
  postId: number
}
