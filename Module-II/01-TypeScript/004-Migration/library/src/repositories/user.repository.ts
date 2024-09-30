import UserModel from '../models/user.model'
import { HttpException } from '../exceptions'
import { hashPassword, verifyPassword } from '../infrastructure/bcrypt'

class UserRepository {
    async find(username) {
        try {
            const user = await UserModel.findOne({ username }, { _id: 0, username: 1, email: 1, fullname: 1, created: 1 }).lean()
            if (!user) {
                throw new Error('Пользователь не найден')
            }
            return user
        } catch (error) {
            throw new HttpException(`Ошибка при получении данных пользователя ${username}: ${error.message}`, 404)
        }
    }

    async verifyPassword(username, password) {
        const user = await UserModel.findOne({ username }).lean()
        return await verifyPassword(password, user.password)
    }

    async registration(body) {
        if (!body.username || !body.email || !body.fullname || !body.password || !body.password_confirm) {
            throw new HttpException('Необходимо заполнить все обязательные поля', 400)
        }

        let existUser
        try {
            existUser = await this.find(body.username)
        } catch (error) { }

        if (existUser) {
            throw new HttpException('Пользователь с таким именем уже зарегистрирован', 400)
        }

        if (body.password.length < 2) {
            throw new HttpException('Пароль слишком короткий', 400)
        }
        if (body.password !== body.password_confirm) {
            throw new HttpException('Пароли не совпадают', 400)
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
            throw new HttpException(`Ошибка при регистрации пользователя ${body.username}: ${error.message}`, 500)
        }
    }
}

export default UserRepository