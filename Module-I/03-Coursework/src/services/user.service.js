import UserModel from '../models/user.model.js'
import CustomError from '../errors/costom.error.js'
import { hashPassword, verifyPassword } from '../config/bcrypt.js'

class UserService {
  async find(username) {
    try {
      const user = await UserModel.findOne({ username }, { _id: 0, username: 1, email: 1, fullname: 1, created: 1 }).lean()
      if (!user) {
        throw new Error('пользователь не найден')
      }
      return user
    } catch (error) {
      throw new CustomError(`Ошибка при получении данных пользователя ${username}: ${error.message}`, 404)
    }
  }

  async verifyPassword(username, password) {
    const user = await UserModel.findOne({ username }).lean()
    return await verifyPassword(password, user.password)
  }

  async registration(body) {
    if (!body.username || !body.email || !body.fullname || !body.password || !body.password_confirm) {
      throw new CustomError('Необходимо заполнить все обязательные поля', 400)
    }
    const existUser = await this.find(body.username)
    if (existUser) {
      throw new CustomError('Пользователь с таким именем уже зарегистрирован', 400)
    }
    if (body.password.length < 2) {
      throw new CustomError('Пароль слишком короткий', 400)
    }
    if (body.password !== body.password_confirm) {
      throw new CustomError('Пароли не совпадают', 400)
    }

    try {
      const user = new UserModel({
        username: body.username,
        email: body.email,
        fullname: body.fullname,
        password: await hashPassword(body.password)
      })
      const newUser = user.save()
      return {
        message: `Пользователь ${body.username} успешно зарегистрирован`
      }
    } catch (error) {
      throw new CustomError(`Ошибка при регистрации пользователя ${body.username}: ${error.message}`, 500)
    }
  }
}

export default new UserService()