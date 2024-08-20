import passport from 'passport'
import { Strategy } from 'passport-local'

import UserService from '../services/user.service.js'

passport.use('local', new Strategy(
  async (username, password, done) => {
    const user = await UserService.find(username)
    if (!user) {
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
  if (await UserService.find(user.username)) {
    return done(null, user)
  } else {
    return done(new Error(`Пользователь ${user.username} не найден`))
  }
})

export default passport