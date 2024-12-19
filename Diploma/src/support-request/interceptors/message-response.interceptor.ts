import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

import { MessageDocument } from '../schemas'
import { IMessageResponse } from '../dto'

/** Интерсептор для форматирования данных сообщения */
@Injectable()
export class MessageResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IMessageResponse | IMessageResponse[]> {

    const formatMessageResponse = (message: MessageDocument): IMessageResponse => ({
      id: message.id.toString(),
      createdAt: message.sentAt.toString(),
      text: message.text,
      readAt: message.readAt?.toString(),
      author: {
        id: message.author.id.toString(),
        name: message.author.name,
      }
    })

    return next.handle().pipe(
      map((message) => {
        return Array.isArray(message)
          ? message.map(res => formatMessageResponse(res))
          : formatMessageResponse(message)
      })
    )
  }
}