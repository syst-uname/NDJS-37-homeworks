import { IsEnum } from 'class-validator'
import { RegisterClientDto } from 'src/auth/dto/auth.dto'
import { ROLE } from '../constants/user.constants'

/** Параметры создания пользователя */
export class CreateUserDto extends RegisterClientDto {

  @IsEnum(ROLE)
  public readonly role?: ROLE
}

/** Параметры получения списка пользователей */
export class FindUsersQueryDto {
  limit?: number
  offset?: number
  name?: string
  email?: string
  contactPhone?: string
}