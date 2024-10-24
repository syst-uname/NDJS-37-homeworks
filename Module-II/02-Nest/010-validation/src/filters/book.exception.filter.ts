import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Response } from 'express'

@Catch(HttpException)
export class BookExceptionFilter implements ExceptionFilter{
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR

    const message = {
      timestamp: new Date().toISOString(),
      status: 'fail',
      data: {
        message: exception.message || 'Internal server error',
      },
      code: status
    }

    response.status(status).json(message)
  }
}