import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets'
import { UseGuards } from '@nestjs/common'
import { Server, Socket } from 'socket.io'

import { SupportRequestService } from '@src/support-request/services'
import { JwtWsAuthGuard } from '@src/auth/guards/jwt-ws-auth.guard'
import { Roles } from '@src/auth/decorators'
import { ROLE } from '@src/auth/constants'
import { ID } from '@src/common/types'


@WebSocketGateway()
export class SupportRequestGateway {
  @WebSocketServer() server: Server

  constructor(private readonly supportRequestService: SupportRequestService) {}

  // подписываемся на обращение при подключении нового клиента
  @UseGuards(JwtWsAuthGuard)
  @Roles(ROLE.MANAGER, ROLE.CLIENT)
  @SubscribeMessage('subscribeToSupportRequest')
  handleSubscribe(client: Socket, payload: { supportRequest: string }): void {
    const unsubscribe = this.supportRequestService.subscribe(
      payload.supportRequest,
      (supportRequest, message) => {
        client.emit('message', {                // Отправляем событие на клиент
          supportRequestId: supportRequest.id,
          message
        })
      })

    client.on('disconnect', unsubscribe)  // Отписываемся, когда клиент отключается
  }

  // получаем сообщение от клиента
  @UseGuards(JwtWsAuthGuard)
  @Roles(ROLE.MANAGER, ROLE.CLIENT)
  @SubscribeMessage('message')
  handleMessage(client: any, payload: { supportRequest: ID; text: string }): void {
    this.supportRequestService.sendMessage({
      supportRequest: payload.supportRequest,
      author: client.user._id,
      text: payload.text
    })
  }

}
