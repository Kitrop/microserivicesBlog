import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { SignInDto, SignUpDto } from 'src/dto/auth.dto'
import { CheckIsLogoutUserGuard } from 'src/guards/login.guard'
import { v4 as uuidv4 } from 'uuid'
import { Response } from 'express'
import { CheckIsLoginUserGuard } from 'src/guards/logout.guard'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('signUp')
    this.authClient.subscribeToResponseOf('signIn')
    await this.authClient.connect()
  }

  @UseGuards(CheckIsLogoutUserGuard)
  @Post('login')
  loginUser(@Body() body: SignInDto, @Res() res: Response) {
    const messageId = uuidv4()
    const newBody = { ...body, messageId }
    const result = this.authClient.send('signIn', newBody)

    result.subscribe((response) => {
      if (response?.data?.accessToken) {
        res.cookie('accessToken', response.data.accessToken, {
          httpOnly: true,
        })
      }
    })

    return result
  }

  @UseGuards(CheckIsLogoutUserGuard)
  @Post('createUser')
  createUser(@Body() body: SignUpDto, @Res() res: Response) {
    const messageId = uuidv4()
    const newBody = { ...body, messageId }
    const result = this.authClient.send('signUp', newBody)

    result.subscribe(
      (response) => {
        if (response?.data?.accessToken) {
          res.cookie('accessToken', response.data.accessToken, {
            httpOnly: true,
          })
        }
        return res.send(response).status(response.status)
      },
      (error) => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error)
      },
    )

    return result
  }

  @UseGuards(CheckIsLoginUserGuard)
  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('accessToken')
    throw new HttpException('User logout', HttpStatus.OK)
  }
}
