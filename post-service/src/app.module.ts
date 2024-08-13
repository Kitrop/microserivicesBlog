import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PostModule } from './post/post.module'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { CommentModule } from './comment/comment.module'
import { LikeModule } from './like/like.module'
import { PostController } from './post/post.controller'
import { LikeController } from './like/like.controller'
import { CommentController } from './comment/comment.controller'
import { LikeService } from './like/like.service'
import { CommentService } from './comment/comment.service'
import { PostService } from './post/post.service'
import { PrismaService } from './prisma.service'

@Module({
  imports: [
    PostModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '300h',
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
