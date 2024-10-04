import express from 'express'

import config from '../config'
import apiRoute from './api/v1'
import viewRoute from './view'
import { error404 } from '../middleware'

const router = express.Router()

router.use(express.static(config.server.publicDir))
router.use('/api/v1', apiRoute)
router.use('/view', viewRoute)
router.use(error404)

export default router