import express from 'express'
import logger from './middleware/logger.js'
import config from './config/index.js'
import router from './routes/index.js'
import error404 from './middleware/error-404.js'

const app = express()

app.use(logger)
app.use(express.json())
app.use('/api', router)
app.use(error404)

app.listen(config.server.port, () => console.log(`Приложение запущено на порту ${config.server.port}`))