import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '300h'
      }
    }),
    AuthModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AuthService, PrismaService]
})
export class AppModule {}
