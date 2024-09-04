import passport from 'passport'
import { Strategy } from 'passport-local'

import { UserService } from '../services/index.js'

passport.use('local', new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    const user = await UserService.findByEmail(email)
    const validatePassword = await UserService.verifyPassword(email, password)
    if (!user || !validatePassword) {
      return done(null, false, { message: 'Неверный логин или пароль' })
    }
    return done(null, user)
  }))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser(async (user, done) => {
  if (await UserService.findByEmail(user.email)) {
    return done(null, user)
  } else {
    return done(new Error(`Пользователь ${user.email} не найден`))
  }
})

export default passport