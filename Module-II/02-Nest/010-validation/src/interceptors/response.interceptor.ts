import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { catchError, map } from 'rxjs'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next
      .handle()
      .pipe(
        map((data) => ({
          status: 'success',
          data,
        })),
        catchError((error) => {
          return [{
            status: 'fail',
            data: { message: error.message }
          }]
        })
      )
  }
}