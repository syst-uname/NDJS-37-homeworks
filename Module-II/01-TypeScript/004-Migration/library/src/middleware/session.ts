import session from 'express-session'
import config from '../config'

const sessionMiddleware = session({
    secret: config.auth.session_secret,
    resave: false,
    saveUninitialized: true
})

export { sessionMiddleware as session }