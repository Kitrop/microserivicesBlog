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
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { IsLoginUserGuard } from './login.guard'
import { v4 as uuidv4 } from 'uuid';
import { partition } from 'rxjs'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
    @Inject('POST_SERVICE') private readonly postClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.authClient.subscribeToResponseOf('my-first-topic');
    this.postClient.subscribeToResponseOf('post_topic');
    this.authClient.subscribeToResponseOf('signUp');
    this.authClient.subscribeToResponseOf('signIn');
    await this.authClient.connect();
    await this.postClient.connect();
  }


  @Get('post')
  secondTest() {
    console.log('connect2!');
    return this.postClient.send('post_topic', 'Hello post');
  }

  @UseGuards(IsLoginUserGuard)
  @Post('login')
  loginUser(@Body() body: SignInDto, @Res() res: Response) {
    const result = this.authClient.send('signIn', body)

    result.subscribe((response) => {
      if (response.accessToken) {
        res.setHeader('Authorization', `Bearer ${response.accessToken}`)
      }
    })

    return result;
  }

  @Post('createUser')
  createUser(@Body() body: SignUpDto, @Res() res) {
    console.log("Received request to create user");
    const messageId = uuidv4()
    const newBody = {...body, messageId }
    const result = this.authClient.send('signUp', newBody);
    console.log("Request sent to auth service");
  
    result.subscribe((response) => {
      console.log("Response received from auth service", response);
      if (response.accessToken) {
        res.setHeader('Authorization', `Bearer ${response.accessToken}`);
        res.cookie('accessToken', response.accessToken)
      }
      return res.send(response);
    }, (error) => {
      console.log("Error received from auth service", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    });
  
    return result;
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.removeHeader('Authorization')
    throw new HttpException('User logout', HttpStatus.OK)
  }
}
