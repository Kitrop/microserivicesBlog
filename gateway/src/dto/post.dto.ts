/* eslint-disable indent */
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(2)
  @MaxLength(350)
  @ApiProperty()
  text: string;
}

export class DeletePostDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  postId: number;
}

export class GetPostsDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  page: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  chunk: number;
}
