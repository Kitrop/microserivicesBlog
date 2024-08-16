import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBody, ApiResponse } from '@nestjs/swagger'
import { LikePostDto } from 'src/dto/like.dto'
import { ReturnedLikeDto } from 'src/dto/returnDto/r_like.dto'

export function LikeResponse() {
  return applyDecorators(ApiBody({ type: LikePostDto }), ApiResponse({ status: HttpStatus.OK, description: 'user like/dislike post', type: ReturnedLikeDto }), ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'post not found/incorrect post' }))
}
