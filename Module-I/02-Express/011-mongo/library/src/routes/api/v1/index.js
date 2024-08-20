import { Router } from 'express'
import { default as userRoute } from './user.route.js'
import { default as bookRoute } from './book.route.js'

const router = Router()

router.use('/user', userRoute)
router.use('/book', bookRoute)

export default router