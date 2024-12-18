import { IsNotEmpty, IsString } from 'class-validator'

/** Параметры создание обращения */
export class CreateSupportRequestDto {

  @IsString({ message: 'Текст обращения должен быть строкой' })
  @IsNotEmpty({ message: 'Поле text не может быть пустым' })
    text: string
}