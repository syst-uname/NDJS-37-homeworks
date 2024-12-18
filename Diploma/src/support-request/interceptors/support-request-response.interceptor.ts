import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

import { SupportRequestDocument } from '../schemas'
import { ISupportRequestResponse } from '../types'

/** Интерсептор для форматирования данных обращения */
@Injectable()
export class CreateSupportResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ISupportRequestResponse | ISupportRequestResponse[]> {

    const formatRequestResponse = (request: SupportRequestDocument): ISupportRequestResponse => ({
      id: request.id.toString(),
      createdAt: request.createdAt.toString(),
      isActive: request.isActive,
      hasNewMessages: request.messages.some(message => !message.readAt),
    })

    return next.handle().pipe(
      map((request) => {
        return Array.isArray(request)
          ? request.map(res => formatRequestResponse(res))
          : formatRequestResponse(request)
      })
    )
  }
}