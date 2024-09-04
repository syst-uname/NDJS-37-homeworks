import { Server } from 'socket.io'

import { ChatService } from '../services/index.js'
import sessionMiddleware from './session.js'

const useSocket = (httpServer) => {
  const io = new Server(httpServer)

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
  })


  // подключение клиента
  io.on('connection', (socket) => {
    if (!socket.request.session.passport) {
      return
    }

    const userId = socket.request.session.passport.user._id
    console.log(`Подключен клиент: ${socket.id}, user: ${userId}`)

    socket.join(userId)

    // подписка на чат
    ChatService.subscribe(async (chatId, message) => {
      console.log(`[subscribe] оповещение о новом сообщении в чате ${chatId}: ${message}`)
    })

    // новое сообщение от клиента
    socket.on('sendMessage', async ({ receiver, text }) => {
      try {
        const author = socket.request.session.passport.user._id
        const message = await ChatService.sendMessage({
          author,
          receiver,
          text
        })

        socket.to(receiver).emit('newMessage', message)   // получателю 
        socket.emit('newMessage', message)
      } catch (error) {
        console.log(error)
        socket.emit('error', { message: `Ошибка при отправке сообщения: ${error.message}` })
      }
    })

    // запрос истории чата
    socket.on('getHistory', async ({ interlocutor }) => {
      try {
        const userId = socket.request.session.passport.user._id
        const chat = await ChatService.find([userId, interlocutor])
        const messages = await ChatService.getHistory(chat._id)
        socket.emit('chatHistory', messages)
      } catch (error) {
        console.log(error)
        socket.emit('error', { message: `Ошибка при отправке истории сообщений: ${error.message}` })
      }
    })
  })
}

export default useSocket