import express from 'express'
import http from 'http'
import path from 'path'

import config from './config'
import router from './routes'
import { sessionMiddleware } from './infrastructure/session'
import passport from './infrastructure/passport'
import { useSocket } from './infrastructure/socket'
import { error, logger } from './middleware' 
import { connectToDatabase } from './infrastructure/db'

console.log(`Директория проекта: ${__dirname}`)   // TODO что с папкой проекта?

const app = express()
const server = new http.Server(app)
useSocket(server)

app.set('views', path.join(config.server.dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger)
app.use(router)
app.use(error)

await connectToDatabase()
server.listen(config.server.port, () => console.log(`Приложение library запущено на порту ${config.server.port}`))