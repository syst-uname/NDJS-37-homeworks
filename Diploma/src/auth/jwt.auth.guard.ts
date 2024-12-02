import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(private reflector: Reflector) {
    super()
  }

  public async canActivate(context: ExecutionContext)  {
    // стандартный механизм аутентификации
    if (!await super.canActivate(context)) {
      return false
    }

    // текущий пользователь из контекста
    const request = context.switchToHttp().getRequest()
    const user = request.user

    // роли из метаданных
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!requiredRoles) {
      return true
    }

    // Проверяем наличие у пользователя необходимой роли
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Недостаточно прав для роли ${user.role}`)
    }

    return true
  }
}