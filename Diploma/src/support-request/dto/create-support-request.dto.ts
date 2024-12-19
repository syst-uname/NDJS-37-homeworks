import { IsNotEmpty, IsString } from 'class-validator'
import { ID } from '@src/common/types'

/** Тело запроса при создании обращения */
export class CreateSupportRequestBodyDto {
  @IsString({ message: 'Текст обращения должен быть строкой' })
  @IsNotEmpty({ message: 'Поле text не может быть пустым' })
    text: string
}

/** Параметры создание обращения */
export class CreateSupportRequestDto extends CreateSupportRequestBodyDto {
  user: ID
}