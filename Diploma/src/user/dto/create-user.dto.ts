import { IsEnum } from 'class-validator'
import { RegisterClientDto } from '@src/auth/dto'
import { USER_ROLE } from '@src/auth/constants'

/** Параметры создания пользователя */
export class CreateUserDto extends RegisterClientDto {

  @IsEnum(USER_ROLE, { message: 'Некорректная роль' })
    role?: USER_ROLE
}