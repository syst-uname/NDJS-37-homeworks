import { IsDate, IsNotEmpty } from 'class-validator'
import { ID } from '@src/common/types'
import { Transform } from 'class-transformer'

/** Тело запроса при событии, что сообщения прочитаны */
export class MarkMessagesAsReadBodyDto {
  @IsDate({ message: 'Момент прочтения должен быть датой' })
  @IsNotEmpty({ message: 'Дата прочтения createdBefore не может быть пустой' })
  @Transform(({ value }) => new Date(value))
    createdBefore?: Date
}

/** Параметры события, что сообщения прочитаны */
export class MarkMessagesAsReadDto extends MarkMessagesAsReadBodyDto {
  user: ID
  supportRequest: ID
}