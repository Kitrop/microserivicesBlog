import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare, genSalt, hash } from 'bcrypt'
import { LoginDto, UserCreateDto } from 'src/dto/user.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async createUser(createDto: UserCreateDto) {
    const findUserByUsername = await this.prisma.user.findUnique({
      where: {
        username: createDto.username
      }
    })

    const findUserByEmail = await this.prisma.user.findUnique({
      where: {
        email: createDto.email
      }
    })

    if (findUserByUsername) {
      return new BadRequestException('user with this username already exist')
    }
    if (findUserByEmail) {
      return new BadRequestException('user with this email already exist')
    }

    const salt = await genSalt()
    const passwordHash = await hash(createDto.password, salt)

    const newUser = await this.prisma.user.create({
      data: {
        email: createDto.email,
        username: createDto.username,
        passwordHash,
        salt
      }
    })

    const jwt = this.jwtService.sign({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    })

    return {
      statusCode: 201,
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        accessToken: jwt
      }
    }
  }

  async signIn(loginDto: LoginDto) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        username: loginDto.username
      }
    })

    if (!findUser) {
      return new NotFoundException('User not found')
    }

    const comparePassword = compare(loginDto.password, findUser.passwordHash)

    const jwt = this.jwtService.sign({
      id: findUser.id,
      username: findUser.username,
      email: findUser.email,
      role: findUser.role
    })

    if (comparePassword) {
      return {
        statusCode: HttpStatus.OK,
        data: {
          id: findUser.id,
          username: findUser.username,
          email: findUser.email,
          accessToken: jwt
        }
      }
    } else {
      return new BadRequestException('incorrect password')
    }
  }
}
