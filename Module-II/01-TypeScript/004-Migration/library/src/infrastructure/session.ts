import session from 'express-session'
import config from '../config'

export const sessionMiddleware = session({
    secret: config.auth.session_secret,
    resave: false,
    saveUninitialized: true
})