import { IsDate, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'
import { ObjectId } from 'mongoose'
import { ParseObjectIdPipe } from '@src/common/pipes'

/** Параметры бронирования номера */
export class CreateReservationDto {

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