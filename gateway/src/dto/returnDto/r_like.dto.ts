/* eslint-disable indent */
import { ApiResponseProperty } from '@nestjs/swagger'

export class ReturnedLikeDto {
  @ApiResponseProperty()
  postId: number

  @ApiResponseProperty()
  like: boolean

  @ApiResponseProperty()
  likes: number

  @ApiResponseProperty()
  comments: number
}
