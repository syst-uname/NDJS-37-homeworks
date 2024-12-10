import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'

/** Параметры добавления номера */
export class CreateHotelRoomDto {

  @IsMongoId({ message: 'ID гостиницы некорректен' })
  @IsNotEmpty({ message: 'ID гостиницы не может быть пустым' })
    hotelId: string

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
    description?: string
}