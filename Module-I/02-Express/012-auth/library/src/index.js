import express from 'express'
import path from 'path';

import session from './config/session.js';
import passport from './config/passport.js';
import config from './config/index.js'
import logger from './middleware/logger.js'
import error from './middleware/error.js';
import router from './routes/index.js'
import connectToDatabase from './db/connection.js';

const app = express()

app.set('views', path.join(config.server.dirname, 'src', 'views'));
app.set('view engine', 'ejs')

app.use(session)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(logger)
app.use(router)
app.use(error)

await connectToDatabase()
app.listen(config.server.port, () => console.log(`Приложение library запущено на порту ${config.server.port}`))