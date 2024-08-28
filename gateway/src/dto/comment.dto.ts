/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  postId: number;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @ApiProperty()
  text: string;
}

export class DeleteCommentDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  commentId: number;
}
