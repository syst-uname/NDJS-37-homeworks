import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

import { HotelRoomDocument } from '../schemas'
import { IHotelRoomResponse } from '../dto'

/** Интерсептор для форматирования данных номера отеля */
@Injectable()
export class HotelRoomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IHotelRoomResponse | IHotelRoomResponse[]> {

    const formatRoomResponse = (room: HotelRoomDocument): IHotelRoomResponse => ({
      id: room.id,
      description: room.description,
      images: room.images,
      isEnabled: room.isEnabled,
      hotel: {
        id: room.hotel.id,
        title: room.hotel.title,
        description: room.hotel.description
      }
    })

    return next.handle().pipe(
      map((room) => {
        return Array.isArray(room)
          ? room.map(room => formatRoomResponse(room))
          : formatRoomResponse(room)
      })
    )
  }
}