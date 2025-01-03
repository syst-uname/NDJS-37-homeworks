import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EventEmitter } from 'events'

import { ISupportRequestService } from '../interfaces'
import { UserDocument } from '@src/user/schemas'
import { MessageDocument, SupportRequest, SupportRequestDocument } from '../schemas'
import { GetChatListParams, MarkMessagesAsReadDto, SendMessageDto } from '../dto'
import { ROLE } from '@src/auth/constants'
import { ID } from '@src/common/types'

@Injectable()
export class SupportRequestService implements ISupportRequestService {

  private eventEmitter: EventEmitter

  constructor(
    @InjectModel(SupportRequest.name) protected supportRequestModel: Model<SupportRequestDocument>
  ) {
    this.eventEmitter = new EventEmitter()
  }

  /** Получение списка обращений в поддержку  */
  async findSupportRequests(data: GetChatListParams): Promise<SupportRequestDocument[]> {
    try {
      const query = this.supportRequestModel.find()
      if (data.user) {
        query.where('user').equals(data.user)
      }
      if (data.isActive !== undefined) {
        query.where('isActive').equals(data.isActive)
      }
      return await query
        .limit(data.limit)
        .skip(data.offset)
        .populate('user')
        .exec()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при получение списка обращений: ${e.message}`)
    }
  }

  /** Получение истории сообщений из обращения в техподдержку */
  async getMessages(supportRequest: ID): Promise<SupportRequestDocument> {
    try {
      return this.findById(supportRequest)
    } catch (e) {
      console.error(e.message, e.stack)
      if (e instanceof NotFoundException) {
        throw e
      }
      throw new InternalServerErrorException(`Ошибка при получение истории сообщений: ${e.message}`)
    }
  }

  /** Отправка сообщения */
  async sendMessage(data: SendMessageDto): Promise<MessageDocument> {
    try {
      const request = await this.findById(data.supportRequest)
      request.messages.push({
        author: data.author,
        sentAt: new Date(),
        text: data.text,
      } as MessageDocument)

      await request.save()
      await request.populate('messages.author')
      const message = request.messages.at(-1)
      // Генерируем событие о новом сообщении в обращении
      this.eventEmitter.emit(`message:${data.supportRequest}`, request, message)
      return message
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при создании обращения: ${e.message}`)
    }
  }

  /** Отправка события, что сообщения прочитаны */
  async markMessagesAsRead(params: MarkMessagesAsReadDto): Promise<void> {
    try {
      const request = await this.findById(params.supportRequest)

      // если вызывает сам автор обращения, то обновляем НЕ его сообщения
      // если вызывает НЕ автор, то обновляем сообщения именно автора
      const isAuthor = request.user.id.toString() === params.user.toString()   // текущий пользователь является автором обращения

      request.messages.forEach(message => {
        if (!message.readAt && message.sentAt < params.createdBefore) {        // еще не прочитано и подходит по времени
          const isQuestion = (message.author as UserDocument).id === request.user.id            // сообщение/вопрос от автора обращения/пользователя
          if ((isAuthor && !isQuestion) || (!isAuthor && isQuestion)) {
            message.readAt = new Date()
          }
        }
      })
      await request.save()
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при проставлении отметки о прочтении: ${e.message}`)
    }
  }

  /** Количество непрочитанных сообщении 
   * question - сообщение/вопрос от автора обращения
   * answer - ответ от сотрудника
   */
  async getUnreadCount(supportRequest: ID , type: 'question' | 'answer'): Promise<number> {
    try {
      const request = await this.findById(supportRequest)

      const unreadMessages = request.messages.filter(message => {
        const isQuestion = (message.author as UserDocument).id === request.user.id            // сообщение/вопрос от автора обращения/пользователя
        return !message.readAt && ((type === 'question' && isQuestion) || (type === 'answer' && !isQuestion))
      })
      return unreadMessages.length
    } catch (e) {
      console.error(e.message, e.stack)
      throw new InternalServerErrorException(`Ошибка при подсчете непрочитанных сообщений: ${e.message}`)
    }
  }

  /** Получение обращения по id */
  async findById(id: ID): Promise<SupportRequestDocument> {
    const request = await this.supportRequestModel
      .findById(id)
      .populate('user')
      .populate({ path: 'messages.author' })
    if (!request) {
      throw new NotFoundException(`Обращение с id "${id}" не найдено`)
    }
    return request
  }

  /** Проверка доступа к обращению */
  async checkClientAccess(supportRequestId: ID, user: UserDocument): Promise<boolean> {
    if (user.role === ROLE.CLIENT) {
      const request = await this.findById(supportRequestId)
      if (user.id !== request.user.id) {
        throw new ForbiddenException('Нет доступа к данному обращению')
      }
    }
    return true
  }

  subscribe(
    supportRequestId: string,
    handler: (supportRequest: SupportRequestDocument, message: MessageDocument) => void
  ): () => void {
    // Подписываемся на событие с идентификатором обращения
    this.eventEmitter.on(`message:${supportRequestId}`, handler)
    return () => {
      this.eventEmitter.removeListener(`message:${supportRequestId}`, handler)   // метод отписки
    }
  }

}
