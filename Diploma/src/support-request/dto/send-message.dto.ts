import { IsNotEmpty } from 'class-validator'
import { ID } from '@src/common/types'

/** Тело запроса при создании сообщения */
export class SendMessageBodyDto {
  @IsNotEmpty({ message: 'Поле text не может быть пустым' })
    text: string
}

/** Параметры создания сообщения */
export class SendMessageDto extends SendMessageBodyDto {
  author: ID
  supportRequest: ID
}