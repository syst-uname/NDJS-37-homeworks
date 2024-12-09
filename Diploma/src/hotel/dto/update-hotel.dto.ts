import { IsOptional, IsString } from 'class-validator'

/** Параметры обновления отеля */
export class UpdateHotelDto {

  @IsString()
  @IsOptional()
    title?: string

  @IsString()
  @IsOptional()
    description?: string
}