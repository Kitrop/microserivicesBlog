/* eslint-disable indent */
import { ApiResponseProperty } from '@nestjs/swagger';

export class Comment {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  userId: number;
  @ApiResponseProperty()
  username: string;
  @ApiResponseProperty()
  text: string;
  @ApiResponseProperty()
  postId: number;
}

export class ReturnedGetAllComments {
  @ApiResponseProperty()
  statusCode: number;

  @ApiResponseProperty({ type: [Comment] })
  data: Comment[];
}

export class DataCreateComment {
  @ApiResponseProperty()
  commentId: number;

  @ApiResponseProperty()
  text: string;

  @ApiResponseProperty()
  likes: number;

  @ApiResponseProperty()
  comments: number;
}

export class ReturnedCreateComment {
  @ApiResponseProperty()
  statusCode: number;

  @ApiResponseProperty({ type: DataCreateComment })
  data: {
    commentId: number;
    text: string;
    likes: number;
    comments: number;
  };
}

export class DataDelete {
  @ApiResponseProperty()
  commentId: number;

  @ApiResponseProperty()
  userId: number;
}

export class ReturnedDeleteComment {
  @ApiResponseProperty()
  statusCode: number;

  @ApiResponseProperty({ type: DataDelete })
  data: {
    commentId: number;
    userId: number;
  };
}

export class DataDeleteAdmin {
  @ApiResponseProperty()
  commentId: number;
}

export class ReturnedDeleteAdminComment {
  @ApiResponseProperty()
  statusCode: number;
  @ApiResponseProperty({
    type: DataDeleteAdmin,
  })
  data: {
    commentId: number;
  };
}
