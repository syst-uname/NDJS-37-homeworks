import express from 'express'
import session from 'express-session'

import { config } from './config/index.js'
import { router } from './routes/index.js'
import { passport } from './infrastructure/passport.js'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('views', 'src/views')
app.set('view engine', 'ejs')
app.use(session({ secret: config.cookieSecret }))
app.use(passport.initialize())
app.use(passport.session())

app.use(router)

app.listen(config.port, () => console.log(`Приложение запущено на порту ${config.port}`))
