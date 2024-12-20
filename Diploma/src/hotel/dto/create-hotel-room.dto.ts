import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { ObjectId } from 'mongoose'
import { ParseObjectIdPipe } from '@src/common/pipes'

/** Тело запроса при добавлении номера */
export class CreateHotelRoomBodyDto {

  @IsNotEmpty({ message: 'ID гостиницы не может быть пустым' })
  @Transform(({ value }) => new ParseObjectIdPipe().transform(value))
    hotelId: ObjectId

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
    description?: string
}

/** Параметры добавления номера */
export class CreateHotelRoomDto extends CreateHotelRoomBodyDto {
  images: Express.Multer.File[]
}