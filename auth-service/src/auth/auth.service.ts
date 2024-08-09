import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
      return new HttpException(
        'User with this username already exist',
        HttpStatus.BAD_REQUEST
      )
    }
    if (findUserByEmail) {
      return new HttpException(
        'User with this email already exist',
        HttpStatus.BAD_REQUEST
      )
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
      return new HttpException('User not found', HttpStatus.NOT_FOUND)
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
        statusCode: 200,
        data: {
          id: findUser.id,
          username: findUser.username,
          email: findUser.email,
          accessToken: jwt
        }
      }
    } else {
      return new HttpException('incorrect password', HttpStatus.BAD_REQUEST)
    }
  }
}
