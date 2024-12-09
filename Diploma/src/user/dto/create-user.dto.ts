import { IsEnum } from 'class-validator'
import { RegisterClientDto } from 'src/auth/dto'
import { ROLE } from '../constants'

/** Параметры создания пользователя */
export class CreateUserDto extends RegisterClientDto {

  @IsEnum(ROLE)
    role?: ROLE
}