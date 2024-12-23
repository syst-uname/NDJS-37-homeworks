import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator'

/** Параметры обновления отеля */
export class UpdateHotelDto {

  @ValidateIf((o) => o.title !== undefined)
  @IsString({ message: 'Название гостиницы должно быть строкой' })
  @IsNotEmpty({ message: 'Название гостиницы не должно быть пустым' })
    title?: string

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
    description?: string
}