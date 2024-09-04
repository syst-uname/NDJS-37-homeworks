import express from 'express'
import http from 'http'

import session from './config/session.js'
import passport from './config/passport.js'
import useSocket from './config/socket.js'
import config from './config/index.js'
import router from './routes/index.js'
import connectToDatabase from './db/connection.js'
import { error } from './middleware/index.js'

const app = express()
const server = http.Server(app)
useSocket(server)

app.use(session)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(router)
app.use(error)

await connectToDatabase()
server.listen(config.server.port, () => console.log(`Приложение library запущено на порту ${config.server.port}`))