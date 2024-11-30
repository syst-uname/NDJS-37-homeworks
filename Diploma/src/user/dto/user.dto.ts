import { IsEnum } from 'class-validator'
import { User } from '../schemas/user.schema'
import { ClientRegisterDto } from 'src/auth/dto/auth.dto'
import { ROLE } from '../constants/user.constants'

// Создание пользователя 
export class UserCreateDto extends ClientRegisterDto {

  @IsEnum(ROLE)
  public readonly role?: User['role']
}