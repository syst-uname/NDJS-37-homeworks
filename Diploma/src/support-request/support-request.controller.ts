import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common'

import { SupportRequestClientService } from './services'
import { CreateSupportRequestDto } from './dto'
import { CreateSupportResponseInterceptor } from './interceptors'
import { JwtAuthRoleGuard } from '@src/auth/guards'
import { AuthUser, Roles } from '@src/auth/decorators'
import { UserDocument } from '@src/user/schemas'
import { USER_ROLE } from '@src/auth/constants'
import { ID } from '@src/common/types'

@Controller()
@UseGuards(JwtAuthRoleGuard)
export class SupportRequestController {
  constructor(private readonly supportRequestClientService: SupportRequestClientService) {}

  // Создание обращения в поддержку
  @Post('client/support-requests')
  @Roles(USER_ROLE.CLIENT)
  @UseInterceptors(CreateSupportResponseInterceptor)
  async create(
    @Body() dto: CreateSupportRequestDto,
    @AuthUser() user: UserDocument
  ) {
    return await this.supportRequestClientService.createSupportRequest({ ...dto, user: user._id as ID })
  }

}
