import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { METADATA_ROLES, ROLE } from '../constants'

/** Проверка авторизации websocket*/
@Injectable()
export class JwtWsAuthGuard extends AuthGuard('jwt') {

  constructor(private reflector: Reflector) {
    super()
  }

  public async canActivate(context: ExecutionContext)  {
    // роли из метаданных
    const requiredRoles = this.reflector.get<ROLE[]>(METADATA_ROLES, context.getHandler())

    if (!requiredRoles) {
      return true   // и если роли не требуются - пропускаем
    }

    // стандартный механизм аутентификации
    if (!await super.canActivate(context)) {
      return false
    }

    // текущий пользователь из контекста
    const client = context.switchToWs().getClient()
    const user = client.user

    // Проверяем наличие у пользователя необходимой роли
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Недостаточно прав для роли ${user.role}`)
    }

    return true
  }

  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient()
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    const ctx = this.getRequest(context)
    ctx.user = user
    return user
  }

}