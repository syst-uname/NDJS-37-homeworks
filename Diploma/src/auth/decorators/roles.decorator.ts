import { SetMetadata } from '@nestjs/common'
import { METADATA_ROLES } from '../constants/constants'

// Декоратор для определения ролей пользователя в контроллере
export const Roles = (...roles: string[]) => SetMetadata(METADATA_ROLES, roles)
