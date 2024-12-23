import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

/** Параметры добавления отеля */
export class CreateHotelDto {

  @IsString({ message: 'Название гостиницы должно быть строкой' })
  @IsNotEmpty({ message: 'Название гостиницы не может быть пустым' })
    title: string

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
    description?: string
}