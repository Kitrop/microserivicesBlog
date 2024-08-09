import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PostModule } from './post/post.module';
import { JwtModule } from '@nestjs/jwt'
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [
    PostModule,     
    JwtModule.register({
    secret: process.env.SECRET_KEY,
    signOptions: {
      expiresIn: '300h'
    }
  }), CommentModule, LikeModule,],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
