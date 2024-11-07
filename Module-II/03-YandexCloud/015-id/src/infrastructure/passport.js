import passport from 'passport'
import { Strategy } from 'passport-yandex'
import { config } from '../config/index.js'

passport.use(
    new Strategy(
        {
            clientID: config.clientID,
            clientSecret: config.clientSecret,
            callbackURL: config.callbackURL
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile)
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((obj, done) => {
    return done(null, obj)
})

export { passport }