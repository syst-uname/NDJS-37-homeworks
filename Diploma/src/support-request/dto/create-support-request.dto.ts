import { IsNotEmpty, IsString } from 'class-validator'
import { ID } from '@src/common/types'

/** Параметры создание обращения */
export class CreateSupportRequestDto {

  user: ID    // не передается в dto, получается в контроллере

  @IsString({ message: 'Текст обращения должен быть строкой' })
  @IsNotEmpty({ message: 'Поле text не может быть пустым' })
    text: string
}