import { Body, Controller, ForbiddenException, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common'

import { SupportRequestClientService, SupportRequestService } from './services'
import { CreateSupportRequestBodyDto, GetChatListParams, SendMessageBodyDto } from './dto'
import { MessageResponseInterceptor, SupportRequestResponseInterceptor } from './interceptors'
import { ParseObjectIdPipe } from '@src/common/pipes'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { User, Roles } from '@src/auth/decorators'
import { UserDocument } from '@src/user/schemas'
import { ROLE } from '@src/auth/constants'
import { ID } from '@src/common/types'

@Controller()
@UseGuards(JwtAuthRoleGuard)
export class SupportRequestController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
  ) {}

  // Создание обращения в поддержку
  @Post('client/support-requests')
  @Roles(ROLE.CLIENT)
  @UseInterceptors(SupportRequestResponseInterceptor)
  async create(
    @Body() body: CreateSupportRequestBodyDto,
    @User() user: UserDocument
  ) {
    return await this.supportRequestClientService.createSupportRequest({
      user: user._id as ID,
      text: body.text,
    })
  }

  // Получение списка обращений в поддержку для клиента
  @Get('client/support-requests')
  @Roles(ROLE.CLIENT)
  @UseInterceptors(SupportRequestResponseInterceptor)
  async getForClient(
    @Query() params: GetChatListParams,
    @User() user: UserDocument
  ) {
    return await this.supportRequestService.findSupportRequests({ ...params, user: user._id as ID })
  }

  // Получение списка обращений в поддержку для менеджера
  @Get('manager/support-requests')
  @Roles(ROLE.MANAGER)
  @UseInterceptors(SupportRequestResponseInterceptor)
  async getForManager(@Query() params: GetChatListParams) {
    delete params.user    // для менеджера user не важен, доступны все обращения
    return await this.supportRequestService.findSupportRequests(params)
  }

  // Получение истории сообщений из обращения в техподдержку
  @Get('common/support-requests/:id/messages')
  @Roles(ROLE.CLIENT, ROLE.MANAGER)
  @UseInterceptors(MessageResponseInterceptor)
  async getMessages(
    @Param('id', ParseObjectIdPipe) id: ID,
    @User() user: UserDocument
  ) {
    await this.supportRequestService.checkClientAccess(id, user)
    const request = await this.supportRequestService.getMessages(id)
    return request.messages
  }

  // Отправка сообщения
  @Post('common/support-requests/:id/messages')
  @Roles(ROLE.CLIENT, ROLE.MANAGER)
  @UseInterceptors(MessageResponseInterceptor)
  async sendMessage(
    @Param('id', ParseObjectIdPipe) id: ID,
    @Body() body: SendMessageBodyDto,
    @User() user: UserDocument
  ) {
    await this.supportRequestService.checkClientAccess(id, user)
    return await this.supportRequestService.sendMessage({
      author: user._id as ID,
      supportRequest: id,
      text: body.text
    })
  }

}
