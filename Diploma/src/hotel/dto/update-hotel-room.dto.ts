import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { ObjectId } from 'mongoose'
import { ParseObjectIdPipe } from '@src/common/pipes'

/** Тело запроса при обновления номера */
export class UpdateHotelRoomBodyDto {

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

/** Параметры обновления номера */
export class UpdateHotelRoomDto extends UpdateHotelRoomBodyDto {
  images: Express.Multer.File[]
}