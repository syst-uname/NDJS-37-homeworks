import passport from 'passport'
import { Strategy } from 'passport-local'

import UserService from '../services/user.service.js'

passport.use('local', new Strategy(
  async (username, password, done) => {
    try {
      const user = await UserService.find(username)
    } catch (error) {
      return done(null, false, { message: `Пользователь ${username} не зарегистрирован` })
    }
    if (!(await UserService.verifyPassword(username, password))) {
      return done(null, false, { message: 'Неверный пароль' })
    }
    return done(null, user)
  }))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser(async (user, done) => {
  try {
    await UserService.find(user.username)
    return done(null, user)
  } catch (error) {
    return done(new Error(`Пользователь ${user.username} не найден!!`))
  }
})

export default passport