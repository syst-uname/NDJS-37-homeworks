import { Controller, ForbiddenException, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common'

import { SupportRequestService } from '../services'
import { MessageResponseInterceptor } from '../interceptors'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { AuthUser, Roles } from '@src/auth/decorators'
import { UserDocument } from '@src/user/schemas'
import { USER_ROLE } from '@src/auth/constants'
import { ID } from '@src/common/types'
import { ParseObjectIdPipe } from '@src/common/pipes'

@Controller('common')
@UseGuards(JwtAuthRoleGuard)
export class SupportRequestController {
  constructor(private readonly supportRequestService: SupportRequestService) {}

  // Получение истории сообщений из обращения в техподдержку
  @Get('support-requests/:id/messages')
  @Roles(USER_ROLE.CLIENT, USER_ROLE.MANAGER)
  @UseInterceptors(MessageResponseInterceptor)
  async getMessages(
    @Param('id', ParseObjectIdPipe) id: ID,
    @AuthUser() user: UserDocument
  ) {
    const request = await this.supportRequestService.getMessages(id)
    if (user.role === USER_ROLE.CLIENT && user.id !== request.user.id ) {
      throw new ForbiddenException('Вы не можете получить историю сообщений другого клиента')
    }
    return request.messages
  }

}
