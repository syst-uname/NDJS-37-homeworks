import session from 'express-session'
import config from '../config'

declare module 'express-session' {
    interface Session {
        messageUserSignup?: string
        messageBook?: string
        messages: string[]
    }
}

const sessionMiddleware = session({
    secret: config.auth.session_secret,
    resave: false,
    saveUninitialized: true
})

export { sessionMiddleware as session }