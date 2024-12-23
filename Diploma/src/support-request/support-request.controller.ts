import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common'

import { SupportRequestClientService, SupportRequestEmployeeService, SupportRequestService } from './services'
import { CreateSupportRequestBodyDto, GetChatListParams, MarkMessagesAsReadBodyDto, SendMessageBodyDto } from './dto'
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
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService
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
    return await this.supportRequestService.findSupportRequests({
      ...params,
      user: user._id as ID
    })
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

  // Отправка события, что сообщения прочитаны
  @Post('common/support-requests/:id/messages/read')
  @Roles(ROLE.CLIENT, ROLE.MANAGER)
  async markMessagesAsRead(
    @Param('id', ParseObjectIdPipe) id: ID,
    @Body() body: MarkMessagesAsReadBodyDto,
    @User() user: UserDocument
  ) {
    await this.supportRequestService.checkClientAccess(id, user)
    await this.supportRequestService.markMessagesAsRead({
      user: user._id as ID,
      supportRequest: id,
      createdBefore: body.createdBefore
    })
    return { 'success': true }
  }

  // Количество непрочитанных сообщений 
  @Get('common/support-requests/:id/messages/unread')
  @Roles(ROLE.CLIENT, ROLE.MANAGER)
  async getUnreadCount(
    @Param('id', ParseObjectIdPipe) id: ID,
    @User() user: UserDocument
  ) {
    await this.supportRequestService.checkClientAccess(id, user)
    const count = user.role === ROLE.CLIENT
      ? await this.supportRequestClientService.getUnreadCount(id)
      : await this.supportRequestEmployeeService.getUnreadCount(id)
    return { count }
  }

  // Закрытие обращения 
  @Delete('manager/support-requests/:id')
  @Roles(ROLE.MANAGER)
  async closeRequest(@Param('id', ParseObjectIdPipe) id: ID) {
    return this.supportRequestEmployeeService.closeRequest(id)
  }

}
