import { Router } from 'express'
import { default as apiRoute } from './api/v1/index.js'
import { default as viewRoute } from './view/index.js'

const router = Router()

router.use('/api/v1', apiRoute)
router.use('/view', viewRoute)

export default router