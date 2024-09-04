import { EventEmitter } from 'events'

import { ChatModel } from '../models/index.js'
import { HttpException } from '../exceptions/index.js'

class ChatService {

  constructor() {
    this.emmitter = new EventEmitter()
  }

  // чат целиком 
  async find(users) {
    try {
      const chat = await ChatModel
        .findOne({ users: { $all: users } })
        .populate('users', { name: 1 })
        .populate('messages')
        .lean()
      return chat
    } catch (error) {
      return null
    }
  }

  // история чата
  async getHistory(id) {
    try {
      const chat = await ChatModel
        .findById(id)
        .populate('messages')
        .lean()
      return chat.messages
    } catch (error) {
      throw new HttpException(error.status || 500, `Ошибка при получении истории сообщений: ${error.message}`)
    }
  }

  // отправка сообщения
  async sendMessage({ author, receiver, text }) {
    try {
      // существующий или новый чат
      let chat = await ChatModel.findOne({ users: { $all: [author, receiver] } })
      if (!chat) {
        chat = new ChatModel({ users: [author, receiver] })
      }

      // новое сообщение
      chat.messages.push({
        author,
        text
      })

      await chat.save()
      const message = chat.messages.at(-1)
      this.emmitter.emit('sendMessage', chat._id, message)
      return message
    } catch (error) {
      throw new HttpException(error.status || 500, `Ошибка при отправке сообщения: ${error.message}`)
    }
  }

  // подписка на новые сообщения
  subscribe(callback) {
    this.emmitter.on('sendMessage', callback)
  }
}

export default new ChatService()