import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PostModule } from './post/post.module';
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    PostModule,     
    JwtModule.register({
    secret: process.env.SECRET_KEY,
    signOptions: {
      expiresIn: '300h'
    }
  }),],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
