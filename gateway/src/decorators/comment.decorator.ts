import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { DeleteCommentDto } from 'src/dto/comment.dto'
import { DeletePostDto } from 'src/dto/post.dto'
import { ReturnedDeleteAdminComment, ReturnedDeleteComment, ReturnedGetAllComments } from 'src/dto/returnDto/r_comment.dto'
import { ReturnedDeleteAdminPost } from 'src/dto/returnDto/r_post.dto'

export function CreatePostResponseApi() {
  return applyDecorators(ApiBody({ type: DeletePostDto }), ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'post delete', type: ReturnedDeleteAdminPost }), ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'user not is admin' }), ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'post not found' }))
}

export function GetAllPostResponseApi() {
  return applyDecorators(ApiResponse({ status: HttpStatus.OK, description: 'get all comments from post', type: ReturnedGetAllComments }), ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'post not found' }), ApiParam({ name: 'id', type: 'number', description: 'post id' }))
}

export function DeleteCommentResponseApi() {
  return applyDecorators(ApiBody({ type: DeleteCommentDto }), ApiResponse({ status: HttpStatus.CREATED, description: 'delete comment from post', type: ReturnedDeleteComment }), ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'user not is author of this comment' }), ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'comment not found' }))
}

export function AdminDeleteCommentResponseApi() {
  return applyDecorators(ApiBody({ type: DeleteCommentDto }), ApiResponse({ status: HttpStatus.CREATED, description: 'delete comment from post', type: ReturnedDeleteAdminComment }), ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'user not admin' }), ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'comment not found' }))
}
