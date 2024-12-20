import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

import { HotelDocument } from '../schemas'
import { IHotelResponse } from '../dto'

/** Интерсептор для форматирования данных отеля */
@Injectable()
export class HotelResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IHotelResponse | IHotelResponse[]> {

    const formatHotelResponse = (hotel: HotelDocument): IHotelResponse => ({
      id: hotel.id,
      title: hotel.title,
      description: hotel.description
    })

    return next.handle().pipe(
      map(hotel => {
        return Array.isArray(hotel)
          ? hotel.map(hotel => formatHotelResponse(hotel))
          : formatHotelResponse(hotel)
      })
    )
  }
}