import { Server } from 'socket.io'
import ejs from 'ejs'
import path from 'path'
import { Server as HttpServer } from 'http'

import config from '../config'
import { container } from './container'
import { session } from '../middleware'
import { CommentService } from '../comment/comment.service'

const commentService = container.get(CommentService)

export const socket = (httpServer: HttpServer) => {
    const io = new Server(httpServer)

    io.use((socket, next) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any)(socket.request, {}, next)
    })

    io.on('connection', (socket) => {

        const { parent } = socket.handshake.query   // комментарии для книги или главной страницы? 
        if (!parent || Array.isArray(parent)) {
            return
        }

        socket.join(parent)

        socket.on('comment', async (data) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const user = (socket as any).request.session.passport.user
                const comment = await commentService.add(parent, user.username, data.text)

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