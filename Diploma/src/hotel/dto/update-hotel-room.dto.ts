import { Transform } from 'class-transformer'
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator'

/** Параметры обновления номера */
export class UpdateHotelRoomDto {

  @IsMongoId({ message: 'ID гостиницы некорректен' })
  @IsOptional()
    hotelId?: string

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
    description?: string

  @IsBoolean({ message: 'Поле isEnabled должно быть boolean' })
  @Transform(({ value }) => [true, 'true', 1, '1'].indexOf(value) > -1)
  @IsOptional()
    isEnabled?: boolean
}