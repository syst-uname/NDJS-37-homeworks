import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

import { UserDocument } from '../schemas'
import { IUserResponse } from '../dto'

/** Интерсептор для форматирования данных отеля */
@Injectable()
export class UserResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IUserResponse | IUserResponse[]> {

    const formatUserResponse = (user: UserDocument): IUserResponse => ({
      id: user.id,
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    })

    return next.handle().pipe(
      map(user => {
        return Array.isArray(user)
          ? user.map(hotel => formatUserResponse(hotel))
          : formatUserResponse(user)
      })
    )
  }
}