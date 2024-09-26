import express from 'express'

import config from '../config/index.js'
import error404 from '../middleware/error-404.js'
import apiRoute from './api/v1/index.js'
import viewRoute from './view/index.js'

const router = express.Router()

router.use(express.static(config.server.publicDir))
router.use('/api/v1', apiRoute)
router.use('/view', viewRoute)
router.use(error404)

export default router