import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

import { BookCommentService } from './bookComment.service'
import { CreateBookCommentDto } from './dto/bookComment.dto'

@WebSocketGateway({ cors: true })
export class BookCommentGateway {
  @WebSocketServer() server: Server

  constructor(private readonly bookCommentService: BookCommentService) {}

  @SubscribeMessage('getAllComments')
  async handleGetAllComments(@MessageBody() payload: { bookId: number }) {
    const comments = await this.bookCommentService.findAllBookComment(payload.bookId)
    this.server.emit('bookComments', comments)
  }

  @SubscribeMessage('addComment')
  async handleAddComment(@MessageBody() payload: CreateBookCommentDto) {
    return await this.bookCommentService.create(payload)
  }

}