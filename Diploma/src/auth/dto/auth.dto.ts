import { IsDefined, IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator'
import { User } from 'src/user/schemas/user.schema'

// регистрация
export class ClientRegisterDto {

  @IsDefined()
  @IsEmail()
  public readonly email: User['email']

  @IsDefined()
  @IsString()
  @MinLength(5)
  public readonly password: string

  @IsDefined()
  @IsString()
  @MinLength(4)
  public readonly name: User['name']

  @IsPhoneNumber()
  public readonly contactPhone: User['contactPhone']
}

// Вход 
export class SigninDto {
  email: User['email']
  password: string
}