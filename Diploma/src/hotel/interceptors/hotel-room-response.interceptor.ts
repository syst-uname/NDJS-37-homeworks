import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, switchMap } from 'rxjs'

import { HotelService } from '../services'
import { HotelRoomDocument } from '../schemas'
import { IHotelRoomResponse } from '../types'

/** Интерсептор для форматирования данных номера отеля */
@Injectable()
export class HotelRoomResponseInterceptor implements NestInterceptor {

  constructor(
    private readonly hotelService: HotelService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<IHotelRoomResponse | IHotelRoomResponse[]> {

    const formatRoomResponse = async (room: HotelRoomDocument): Promise<IHotelRoomResponse> => {
      const hotel = await this.hotelService.findById(room.hotel)
      return {
        id: room.id,
        description: room.description,
        images: room.images,
        isEnabled: room.isEnabled,
        hotel: {
          id: hotel.id,
          title: hotel.title,
          description: hotel.description
        }
      }
    }

    return next.handle().pipe(
      switchMap(async (room) => {
        return Array.isArray(room)
          ? await Promise.all(room.map(async room => await formatRoomResponse(room)))
          : await formatRoomResponse(room)
      })
    )
  }
}