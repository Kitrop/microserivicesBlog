import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare, genSalt, hash } from 'bcrypt'
import { LoginDto, UserCreateDto } from 'src/dto/user.dto'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async createUser(createDto: UserCreateDto) {
		const findUserByUsername = await this.prisma.user.findUnique({ where: {
			username: createDto.username
		}})

		const findUserByEmail = await this.prisma.user.findUnique({ where: {
			username: createDto.email
		}})

		if (findUserByUsername) {
			return new HttpException("User with this username already exist", HttpStatus.BAD_REQUEST)
		}
		if (findUserByEmail) {
			return new HttpException("User with this email already exist", HttpStatus.BAD_REQUEST) 
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
			id: newUser.id,
			username: newUser.username,
			email: newUser.email,
			accessToken: jwt
		}
	}

	async signIn(loginDto: LoginDto) {
		const findUser = await this.prisma.user.findUnique({ where: {
			username: loginDto.login	
		}})

		if (!findUser) {
			return new HttpException("User not found", HttpStatus.NOT_FOUND) 
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
				id: findUser.id,
				username: findUser.username,
				email: findUser.email,
				accessToken: jwt,
			}
		} 
		else  {
			return new HttpException('incorrect password', HttpStatus.BAD_REQUEST)
		}
	}

	verifyJwt(token: string) {
		return this.jwtService.verify(token, {
			secret: this.configService.get('SECRET_KEY'),
			ignoreExpiration: false
		})
	}
}
