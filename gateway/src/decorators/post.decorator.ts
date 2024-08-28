import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto, DeletePostDto, GetPostsDto } from 'src/dto/post.dto';
import { ReturnedCreatePost, ReturnedDeleteAdminPost, ReturnedDeletePost, ReturnedGetAllPosts } from 'src/dto/returnDto/r_post.dto';

export function AdminDeletePostResponseLike() {
  return applyDecorators(ApiBody({ type: DeletePostDto }), ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'post delete', type: ReturnedDeleteAdminPost }), ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'user not is admin' }), ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'post not found' }));
}

export function DeletePostResponseLike() {
  return applyDecorators(ApiBody({ type: DeletePostDto }), ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'post delete', type: ReturnedDeletePost }), ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'user not is author of this post' }), ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'post not found' }));
}

export function CreatePostResponseLike() {
  return applyDecorators(ApiBody({ type: CreatePostDto }), ApiResponse({ status: HttpStatus.CREATED, description: 'create post', type: ReturnedCreatePost }));
}

export function AllPostResponseLike() {
  return applyDecorators(ApiBody({ type: GetPostsDto }), ApiResponse({ status: HttpStatus.OK, description: 'get all posts', type: ReturnedGetAllPosts }));
}
