import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma.service'

@Module({
  imports: [],
  controllers: [PostController],
  providers: [PostService, JwtService, ConfigService, PrismaService]
})
export class PostModule {}
