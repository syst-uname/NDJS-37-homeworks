import { IsEnum } from 'class-validator'

import { IRegisterClientResponse, RegisterClientDto } from '@src/auth/dto'
import { ROLE } from '@src/auth/constants'

/** Параметры создания пользователя */
export class CreateUserDto extends RegisterClientDto {

  @IsEnum(ROLE, { message: 'Некорректная роль' })
    role?: ROLE
}

/** Ответ при создании пользователя */
export interface ICreateUserResponse extends IRegisterClientResponse {
  contactPhone?: string,
  role: ROLE,
}