import { Server } from 'socket.io'
import ejs from 'ejs'
import path from 'path'

import CommentService from '../services/comment.service.js'
import config from './index.js'
import sessionMiddleware from './session.js'

const useSocket = (httpServer) => {
  const io = new Server(httpServer)

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
  })

  io.on('connection', (socket) => {

    const { parent } = socket.handshake.query   // комментарии для книги или главной страницы? 
    socket.join(parent)

    socket.on('comment', async (data) => {
      try {
        const user = socket.request.session.passport.user
        const comment = await CommentService.add(parent, user.username, data.text)

        // приходится передавать готовый код html страницы чтобы не писать его на клиенте вручную
        // причем разделяются стили сообщения для себя и остальных пользователей
        const htmlMe = await ejs.renderFile(path.join(config.server.dirname, 'src/views/comment/message-floating-right.ejs'), { comment })
        const htmlOther = await ejs.renderFile(path.join(config.server.dirname, 'src/views/comment/message-floating-left.ejs'), { comment })
        socket.emit('comment', { content: htmlMe })
        socket.to(parent).emit('comment', { content: htmlOther })
      } catch (error) {
        console.log(error)
      }
    })
  })
}

export default useSocket