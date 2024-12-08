import { IsOptional, IsString } from 'class-validator'

/** Параметры добавления отеля */
export class CreateHotelDto {

  @IsString()
  @IsOptional()
    title: string

  @IsString()
  @IsOptional()
    description: string
}