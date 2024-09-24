import passport from 'passport'
import { Strategy } from 'passport-local'

import container from './container.js'
import { UserRepository } from '../repositories/index.js'

const userRepository = container.get(UserRepository)

passport.use('local', new Strategy(
  async (username, password, done) => {
    try {
      const user = await userRepository.find(username)
      if (!(await userRepository.verifyPassword(username, password))) {
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
    await userRepository.find(user.username)
    return done(null, user)
  } catch (error) {
    return done(new Error(`Пользователь ${user.username} не найден`))
  }
})

export default passport