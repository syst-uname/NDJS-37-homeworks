import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

import { SupportRequestDocument } from '../schemas'
import { ISupportRequestResponse } from '../dto'
import { USER_ROLE } from '@src/auth/constants'

/** Интерсептор для форматирования данных обращения */
@Injectable()
export class SupportRequestResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ISupportRequestResponse | ISupportRequestResponse[]> {

    // вывод зависит от роли пользователя
    const request = context.switchToHttp().getRequest()
    const user = request.user

    const formatRequestResponse = (request: SupportRequestDocument): ISupportRequestResponse => ({
      id: request.id.toString(),
      createdAt: request.createdAt.toString(),
      isActive: request.isActive,
      hasNewMessages: request.messages.some(message => !message.readAt),
      client: user.role === USER_ROLE.MANAGER ? {
        id: request.user.id.toString(),
        name: request.user.name,
        email: request.user.email,
        contactPhone: request.user.contactPhone
      } : undefined
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