import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

/** Параметры входа */
export class LoginDto {

  @IsEmail({}, { message: 'Некорректный формат почты' })
  @IsNotEmpty({ message: 'Поле email обязательна для заполнения' })
    email: string

  @IsString({ message: 'Пароль должно быть строкой' })
  @IsNotEmpty({ message: 'Поле password обязательно для заполнения' })
    password: string
}

/** Ответ при входе */
export interface ILoginResponse {
  email: string,
  name: string,
  contactPhone: string,
}