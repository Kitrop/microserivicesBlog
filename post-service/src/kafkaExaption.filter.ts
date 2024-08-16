import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { log } from 'console'

@Catch(HttpException)
export class KafkaExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToRpc()
    const response = ctx.getContext()

    // Получаем статус и сообщение
    const status = exception.getStatus()
    const exceptionResponse: any = exception.getResponse()

    const message = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message
    log(message)
    const errorResponse = {
      statusCode: status,
      message: message || exception.message || null,
      error: {
        message: message || 'Unknown error',
        statusCode: status,
      },
    }

    // Бросаем RpcException с кастомным сообщением
    throw new RpcException(errorResponse)
  }
}
