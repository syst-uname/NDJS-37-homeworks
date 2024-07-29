import express from 'express'
import path from 'path';

import logger from './middleware/logger.js'
import config from './config/index.js'
import router from './routes/index.js'
import error404 from './middleware/error-404.js'

const app = express()

app.set('views', path.join(config.server.dirname, 'src', 'views'));
app.set('view engine', 'ejs')
app.use(express.urlencoded());
app.use(express.json())
app.use(logger)
app.use(router)
app.use(error404)

app.listen(config.server.port, () => console.log(`Приложение library запущено на порту ${config.server.port}`))