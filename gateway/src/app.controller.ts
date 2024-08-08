import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { AppService } from './app.service'
import { SignInDto, SignUpDto } from './dto/auth.dto'
import { CheckIsLogoutUserGuard } from './guards/login.guard'
import { CheckIsLoginUserGuard } from './guards/logout.guard'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    @Inject('POST_SERVICE') private readonly postClient: ClientKafka,
  ) {}

  private logger = new Logger(AppController.name)

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('my-first-topic')
    this.postClient.subscribeToResponseOf('post_topic')
    this.authClient.subscribeToResponseOf('signUp')
    this.authClient.subscribeToResponseOf('signIn')
    await this.authClient.connect()
    await this.postClient.connect()
  }

  @Get('post')
  secondTest() {
    return this.postClient.send('post_topic', 'Hello post')
  }

  @UseGuards(CheckIsLogoutUserGuard)
  @Post('login')
  loginUser(@Body() body: SignInDto, @Res() res: Response) {
    const messageId = uuidv4()
    const newBody = { ...body, messageId }
    const result = this.authClient.send('signIn', newBody)

    result.subscribe((response) => {
      if (response.accessToken) {
        res.setHeader('Authorization', `Bearer ${response.accessToken}`)
      }
    })

    return result
  }

  @UseGuards(CheckIsLogoutUserGuard)
  @Post('createUser')
  createUser(@Body() body: SignUpDto, @Res() res: Response) {
    this.logger.log('Received request to create user')
    const messageId = uuidv4()
    const newBody = { ...body, messageId }
    const result = this.authClient.send('signUp', newBody)

    result.subscribe(
      (response) => {
        if (response?.accessToken) {
          res.setHeader('Authorization', `Bearer ${response.accessToken}`)
          res.cookie('accessToken', response.accessToken, { httpOnly: true })
        }
        return res.send(response)
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
    res.removeHeader('Authorization')
    res.clearCookie('accessToken')
    throw new HttpException('User logout', HttpStatus.OK)
  }
}
