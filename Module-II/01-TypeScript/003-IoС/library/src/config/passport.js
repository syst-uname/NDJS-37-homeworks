import passport from 'passport'
import { Strategy } from 'passport-local'

import { UserRepository } from '../repositories/index.js'

passport.use('local', new Strategy(
  async (username, password, done) => {
    try {
      const user = await UserRepository.find(username)
      if (!(await UserRepository.verifyPassword(username, password))) {
        return done(null, false, { message: 'Неверный пароль' })
      }
      return done(null, user)
    } catch (error) {
      return done(null, false, { message: `Пользователь ${username} не зарегистрирован` })
    }
  }))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser(async (user, done) => {
  try {
    await UserRepository.find(user.username)
    return done(null, user)
  } catch (error) {
    return done(new Error(`Пользователь ${user.username} не найден`))
  }
})

export default passport