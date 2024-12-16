import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'

import { ReservationDocument } from '../schemas'
import { IReservationResponse } from '../types'

/** Интерсептор для форматирования данных номера отеля */
@Injectable()
export class ReservationResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IReservationResponse | IReservationResponse[]> {

    const formatReservationResponse = (reservation: ReservationDocument): IReservationResponse => ({
      startDate: reservation.dateStart.toDateString(),
      endDate: reservation.dateEnd.toDateString(),
      hotelRoom: {
        description: reservation.roomId.description,
        images: reservation.roomId.images
      },
      hotel: {
        title: reservation.hotelId.title,
        description: reservation.hotelId.description
      }
    })

    return next.handle().pipe(
      map((reservation) => {
        return Array.isArray(reservation)
          ? reservation.map(res => formatReservationResponse(res))
          : formatReservationResponse(reservation)
      })
    )
  }
}