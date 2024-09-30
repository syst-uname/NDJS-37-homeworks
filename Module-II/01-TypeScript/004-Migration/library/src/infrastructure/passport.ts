import passport from 'passport'
import { Strategy } from 'passport-local'

import { container } from './container'
import { UserService } from '../services'

const userService = container.get(UserService)

passport.use('local', new Strategy(
    async (username, password, done) => {
        try {
            const user = await userService.find(username)
            if (!(await userService.verifyPassword(username, password))) {
                return done(null, false, { message: 'Неверный пароль' })
            }
            return done(null, user)
        } catch {           //  TODO проверить 
            return done(null, false, { message: `Пользователь ${username} не зарегистрирован` })
        }
    }))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser(async (user, done) => {
    try {
        await userService.find(user.username)        //  TODO  конкретный тип 
        return done(null, user)
    } catch {
        return done(new Error(`Пользователь ${user.username} не найден`))
    }
})

export { passport }