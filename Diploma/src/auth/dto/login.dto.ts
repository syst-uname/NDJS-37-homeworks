import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

/** Параметры входа */
export class LoginDto {

  @IsEmail({}, { message: 'Некорректная почта' })
  @IsNotEmpty({ message: 'Поле email обязательна для заполнения' })
    email: string

  @IsString({ message: 'Пароль должно быть строкой' })
  @IsNotEmpty({ message: 'Поле password обязательно для заполнения' })
    password: string
}