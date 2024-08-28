/* eslint-disable indent */
import { ApiResponseProperty } from '@nestjs/swagger';

export class Post {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  userId: number;
  @ApiResponseProperty()
  message: string;
}

export class DataGetAllPosts {
  @ApiResponseProperty({ type: [Post] })
  post: Post[];

  @ApiResponseProperty()
  page: number;

  @ApiResponseProperty()
  chunk: number;
}

export class ReturnedGetAllPosts {
  statusCode: number;
  data: {
    posts: Post[];
    page: number;
    chunk: number;
  };
}

export class ReturnedCreatePost {
  @ApiResponseProperty()
  statusCode: number;

  @ApiResponseProperty({ type: Post })
  data: Post;
}

export class DataDeletePost {
  @ApiResponseProperty()
  postId: number;

  @ApiResponseProperty()
  userId: number;
}

export class ReturnedDeletePost {
  @ApiResponseProperty()
  statusCode: number;
  @ApiResponseProperty({ type: DataDeletePost })
  data: DataDeletePost;
}

export class DataDeleteAdminPost {
  @ApiResponseProperty()
  postId: number;
}

export class ReturnedDeleteAdminPost {
  @ApiResponseProperty()
  statusCode: number;
  @ApiResponseProperty({ type: DataDeleteAdminPost })
  data: DataDeleteAdminPost;
}
