import { IsDefined, IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator'

/** Параметры регистрации */
export class RegisterClientDto {

  @IsDefined()
  @IsEmail()
  public readonly email: string

  @IsDefined()
  @IsString()
  @MinLength(5)
  public readonly password: string

  @IsDefined()
  @IsString()
  @MinLength(4)
  public readonly name: string

  @IsPhoneNumber()
  public readonly contactPhone: string
}

/** Параметры входа */
export class LoginDto {

  @IsEmail()
    email: string

  @IsDefined()
    password: string
}