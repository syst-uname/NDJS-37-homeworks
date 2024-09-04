import { Router } from 'express'
import userRoute from './user.route.js'
import advertisementRoute from './advertisement.route.js'
import chatRoute from './chat.route.js'

const router = Router()

router.use('/user', userRoute)
router.use('/advertisement', advertisementRoute)
router.use('/chat', chatRoute)

export default router