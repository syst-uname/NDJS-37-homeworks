import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { METADATA_ROLES, ROLE } from '../constants'

/** Проверка авторизации и ролей*/
@Injectable()
export class JwtAuthRoleGuard extends AuthGuard('jwt') {

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
    const request = context.switchToHttp().getRequest()
    const user = request.user

    // Проверяем наличие у пользователя необходимой роли
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Недостаточно прав для роли ${user.role}`)
    }

    return true
  }
}