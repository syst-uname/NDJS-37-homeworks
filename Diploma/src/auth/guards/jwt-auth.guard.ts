import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/** Проверка что пользователь вообще авторизован*/
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public async canActivate(context: ExecutionContext)  {
    return await super.canActivate(context) as boolean
  }
}