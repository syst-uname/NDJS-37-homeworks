import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtUnauthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    try {
      await super.canActivate(context)
    } catch {
      return true     // пользователь не аутентифицирован, пропускаем доступ
    }
    // если проверка прошла успешно, то запрещаем доступ 
    throw new ForbiddenException('Доступно только не аутентифицированным пользователям')
  }
}
