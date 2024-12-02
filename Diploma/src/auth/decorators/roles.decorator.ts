import { SetMetadata } from '@nestjs/common'

// Декоратор для определения ролей пользователя в контроллере
export const Roles = (...roles: string[]) => SetMetadata('roles', roles)
