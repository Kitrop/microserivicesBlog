import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
// import { LikeModule } from './like/like.module'
import { PostModule } from './post/post.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 30000,
        limit: 100,
      },
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '300h',
      },
    }),
    ConfigModule.forRoot(),
    AuthModule,
    PostModule,
    CommentModule,
    // LikeModule,
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
