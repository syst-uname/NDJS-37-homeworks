import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common'

import { SupportRequestEmployeeService } from '../services'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { Roles } from '@src/auth/decorators'
import { USER_ROLE } from '@src/auth/constants'
import { SupportRequestResponseInterceptor } from '../interceptors'
import { GetChatListParams } from '../dto'

@Controller('manager')
@UseGuards(JwtAuthRoleGuard)
export class SupportRequestManagerController {
  constructor(private readonly supportRequestEmployeeService: SupportRequestEmployeeService) {}

  // Получение списка обращений в поддержку для менеджера
  @Get('support-requests')
  @Roles(USER_ROLE.MANAGER)
  @UseInterceptors(SupportRequestResponseInterceptor)
  async get(@Query() params: GetChatListParams) {
    delete params.user
    return await this.supportRequestEmployeeService.findSupportRequests(params)
  }

}
