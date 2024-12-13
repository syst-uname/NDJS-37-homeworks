import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { ObjectId } from 'mongoose'

import { ParseObjectIdPipe } from '@src/common/pipes'

/** Параметры обновления номера */
export class UpdateHotelRoomDto {

  @Transform(({ value }) => new ParseObjectIdPipe().transform(value))
  @IsOptional()
    hotelId?: ObjectId

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
    description?: string

  @IsBoolean({ message: 'Поле isEnabled должно быть boolean' })
  @Transform(({ value }) => [true, 'true', 1, '1'].indexOf(value) > -1)
  @IsOptional()
    isEnabled?: boolean
}