import { IsDate, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'
import { ObjectId } from 'mongoose'

import { ParseObjectIdPipe } from '@src/common/pipes'
import { ID } from '@src/common/types'

/** Тело запроса при бронировании номера */
export class CreateReservationBodyDto {

  @IsNotEmpty({ message: 'ID номера не может быть пустым' })
  @Transform(({ value }) => new ParseObjectIdPipe().transform(value))
    hotelRoom: ObjectId

  @IsDate({ message: 'Начало бронирования должно быть датой' })
  @IsNotEmpty({ message: 'Начало бронирования не может быть пустым' })
  @Transform(({ value }) => new Date(value))
    startDate: Date

  @IsDate({ message: 'Окончание бронирования должно быть датой' })
  @IsNotEmpty({ message: 'Окончание бронирования не может быть пустым' })
  @Transform(({ value }) => new Date(value))
    endDate: Date
}

/** Параметры создание обращения */
export class CreateReservationDto extends CreateReservationBodyDto {
  userId: ID
}