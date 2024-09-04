import express from 'express'

import config from '../config/index.js'
import apiRoute from './api/index.js'
import { error404 } from '../middleware/index.js'

const router = express.Router()

router.use(express.static(config.server.publicDir))
router.use('/api', apiRoute)
router.use(error404)

export default router