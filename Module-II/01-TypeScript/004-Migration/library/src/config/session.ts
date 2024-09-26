import session from 'express-session'
import config from './index.js'

const sessionMiddleware = session({
    secret: config.auth.session_secret,
    resave: false,
    saveUninitialized: true
})

export default sessionMiddleware