import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common'

import { SupportRequestClientService } from '../services'
import { CreateSupportRequestBodyDto, GetChatListParams } from '../dto'
import { SupportRequestResponseInterceptor } from '../interceptors'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { User, Roles } from '@src/auth/decorators'
import { UserDocument } from '@src/user/schemas'
import { ROLE } from '@src/auth/constants'
import { ID } from '@src/common/types'

@Controller('client')
@UseGuards(JwtAuthRoleGuard)
export class SupportRequestClientController {
  constructor(private readonly supportRequestClientService: SupportRequestClientService) {}

  // Создание обращения в поддержку
  @Post('support-requests')
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
  @Get('support-requests')
  @Roles(ROLE.CLIENT)
  @UseInterceptors(SupportRequestResponseInterceptor)
  async get(
    @Query() params: GetChatListParams,
    @User() user: UserDocument
  ) {
    return await this.supportRequestClientService.findSupportRequests({ ...params, user: user._id as ID })
  }

}
