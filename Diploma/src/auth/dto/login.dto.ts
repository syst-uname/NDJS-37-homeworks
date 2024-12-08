import { IsDefined, IsEmail } from 'class-validator'

/** Параметры входа */
export class LoginDto {

  @IsEmail()
    email: string

  @IsDefined()
    password: string
}