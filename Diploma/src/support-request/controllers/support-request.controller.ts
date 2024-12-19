import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common'

import { SupportRequestService } from '../services'
import { MessageResponseInterceptor } from '../interceptors'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { User, Roles } from '@src/auth/decorators'
import { UserDocument } from '@src/user/schemas'
import { ROLE } from '@src/auth/constants'
import { ID } from '@src/common/types'
import { ParseObjectIdPipe } from '@src/common/pipes'
import { SendMessageBodyDto } from '../dto'

@Controller('common')
@UseGuards(JwtAuthRoleGuard)
export class SupportRequestController {
  constructor(private readonly supportRequestService: SupportRequestService) {}

  // Получение истории сообщений из обращения в техподдержку
  @Get('support-requests/:id/messages')
  @Roles(ROLE.CLIENT, ROLE.MANAGER)
  @UseInterceptors(MessageResponseInterceptor)
  async getMessages(
    @Param('id', ParseObjectIdPipe) id: ID,
    @User() user: UserDocument
  ) {
    const request = await this.supportRequestService.getMessages(id)
    if (user.role === ROLE.CLIENT && user.id !== request.user.id) {
      throw new ForbiddenException('Вы не можете получить историю сообщений другого клиента')
    }
    return request.messages
  }

  // Отправка сообщения
  @Post('support-requests/:id/messages')
  @Roles(ROLE.CLIENT, ROLE.MANAGER)
  @UseInterceptors(MessageResponseInterceptor)
  async sendMessage(
    @Param('id', ParseObjectIdPipe) id: ID,
    @Body() body: SendMessageBodyDto,
    @User() user: UserDocument
  ) {
    if (user.role === ROLE.CLIENT) {
      const request = await this.supportRequestService.findById(id)
      if (user.id !== request.user.id) {
        throw new ForbiddenException('Вы не можете отправить сообщение другому клиенту')
      }
    }
    return await this.supportRequestService.sendMessage({
      author: user._id as ID,
      supportRequest: id,
      text: body.text
    })
  }

}
