import { Test, TestingModule } from '@nestjs/testing'
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices'
import { of } from 'rxjs'
import { Response } from 'express'
import { CommentController } from './comment.controller'
import { CreateCommentDto, DeleteCommentDto } from '../dto/comment.dto'
import { ConfigService } from '@nestjs/config'
import { CheckIsLoginUserGuard } from '../guards/logout.guard'
import { JwtService } from '@nestjs/jwt'
import { randomBytes } from 'crypto'

describe('CommentController', () => {
  let controller: CommentController
  let clientKafka: ClientKafka

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'POST_COMMENT_SERVICE',
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'gateway',
                brokers: ['localhost:9092'],
              },
              consumer: {
                groupId: 'gateway-consumer' + randomBytes(16).toString('hex'),
                allowAutoTopicCreation: true,
              },
              producer: {
                allowAutoTopicCreation: true,
                idempotent: true,
                maxInFlightRequests: 1,
              },
              send: {
                acks: -1,
              },
            },
          },
        ]),
      ],
      controllers: [CommentController],
      providers: [
        CheckIsLoginUserGuard,
        {
          provide: JwtService,
          useValue: {
            // Mock the methods you are using in your guard or controller
            sign: jest.fn().mockReturnValue('mockToken'),
            verify: jest.fn().mockReturnValue({}),
          },
        },
        ConfigService,
      ],
    }).compile()

    controller = module.get<CommentController>(CommentController)
    clientKafka = module.get<ClientKafka>('POST_COMMENT_SERVICE')
  })

  it('should send a createComment message and return the result', (done) => {
    const createCommentDto: CreateCommentDto = { postId: 1, text: 'Test Comment' }
    const mockRes = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response

    const req = { cookies: { accessToken: 'testToken' } } as any
    const responseMock = { statusCode: 201, data: 'Comment created' }

    jest.spyOn(clientKafka, 'send').mockReturnValue(of(responseMock))

    controller.createComment(createCommentDto, mockRes, req)

    expect(clientKafka.send).toHaveBeenCalledWith(
      'createComment',
      expect.objectContaining({
        postId: createCommentDto.postId,
        text: createCommentDto.text,
        accessToken: req.cookies.accessToken,
      }),
    )

    setTimeout(() => {
      expect(mockRes.send).toHaveBeenCalledWith(responseMock)
      expect(mockRes.status).toHaveBeenCalledWith(responseMock.statusCode)
      done()
    }, 0)
  })

  it('should send a createComment message and return the result', (done) => {
    const createCommentDto: CreateCommentDto = { postId: 1, text: 'Test Comment' }
    const mockRes = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response

    const req = { cookies: { accessToken: 'testToken' } } as any
    const responseMock = { statusCode: 200, data: 'Comment created' }

    jest.spyOn(clientKafka, 'send').mockReturnValue(of(responseMock))

    controller.createComment(createCommentDto, mockRes, req)

    expect(clientKafka.send).toHaveBeenCalledWith(
      'createComment',
      expect.objectContaining({
        postId: createCommentDto.postId,
        text: createCommentDto.text,
        accessToken: req.cookies.accessToken,
      }),
    )

    setTimeout(() => {
      expect(mockRes.send).toHaveBeenCalledWith(responseMock)
      expect(mockRes.status).toHaveBeenCalledWith(responseMock.statusCode)
      done()
    }, 0)
  })
  it('should send a getAllComments message and return the result', (done) => {
    const postId = 1
    const mockRes = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response

    const responseMock = { statusCode: 200, data: ['Comment1', 'Comment2'] }

    jest.spyOn(clientKafka, 'send').mockReturnValue(of(responseMock))

    controller.getAllComments(postId, mockRes)

    expect(clientKafka.send).toHaveBeenCalledWith(
      'getAllComments',
      expect.objectContaining({
        postId: postId,
      }),
    )

    setTimeout(() => {
      expect(mockRes.send).toHaveBeenCalledWith(responseMock)
      expect(mockRes.status).toHaveBeenCalledWith(responseMock.statusCode)
      done()
    }, 0)
  })
  it('should send a deleteMyComment message and return the result', (done) => {
    const deleteCommentDto: DeleteCommentDto = { commentId: 1 }
    const mockRes = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response

    const req = { cookies: { accessToken: 'testToken' } } as any
    const responseMock = { statusCode: 200, data: 'Comment deleted' }

    jest.spyOn(clientKafka, 'send').mockReturnValue(of(responseMock))

    controller.deleteMyComment(deleteCommentDto, mockRes, req)

    expect(clientKafka.send).toHaveBeenCalledWith(
      'deleteMyComment',
      expect.objectContaining({
        commentId: deleteCommentDto.commentId,
        accessToken: req.cookies.accessToken,
      }),
    )

    setTimeout(() => {
      expect(mockRes.send).toHaveBeenCalledWith(responseMock)
      expect(mockRes.status).toHaveBeenCalledWith(responseMock.statusCode)
      done()
    }, 0)
  })
  it('should send a deleteCommentAdmin message and return the result', (done) => {
    const deleteCommentDto: DeleteCommentDto = { commentId: 1 }
    const mockRes = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response

    const req = { cookies: { accessToken: 'testToken' } } as any
    const responseMock = { statusCode: 200, data: 'Admin comment deleted' }

    jest.spyOn(clientKafka, 'send').mockReturnValue(of(responseMock))

    controller.deleteCommentAdmin(deleteCommentDto, mockRes, req)

    expect(clientKafka.send).toHaveBeenCalledWith(
      'deleteCommentAdmin',
      expect.objectContaining({
        commentId: deleteCommentDto.commentId,
        accessToken: req.cookies.accessToken,
      }),
    )

    setTimeout(() => {
      expect(mockRes.send).toHaveBeenCalledWith(responseMock)
      expect(mockRes.status).toHaveBeenCalledWith(responseMock.statusCode)
      done()
    }, 0)
  })
})
