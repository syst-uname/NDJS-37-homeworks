import { IsDefined, IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator'

/** Параметры регистрации */
export class RegisterClientDto {

  @IsDefined()
  @IsEmail()
    email: string

  @IsDefined()
  @IsString()
  @MinLength(5)
    password: string

  @IsDefined()
  @IsString()
  @MinLength(4)
    name: string

  @IsPhoneNumber()
    contactPhone: string
}