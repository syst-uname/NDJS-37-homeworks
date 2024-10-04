import { IUser } from './user.interface'

export interface UserDto {
  username: IUser['username']
  email: IUser['email']
  fullname: IUser['fullname']
  created: IUser['created']
}

export interface CreateUserDto {
  username: IUser['username']
  email: IUser['email']
  fullname: IUser['fullname']
  password: IUser['password']
  password_confirm: IUser['password']
}

export interface RegistrationUserDto {
  message: string
}