import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { USER_ROLE } from '@src/auth/constants'

/** Проверка на активацию isEnabled для номера */
@Injectable()
export class RoomEnabledGuard extends AuthGuard('jwt') {

  public async canActivate(context: ExecutionContext)  {
    // есть ли аутентификация
    try {
      await super.canActivate(context)
    }
    catch {}

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || user.role === USER_ROLE.CLIENT) {
      request.query.isEnabled = true
    }

    return true
  }
}