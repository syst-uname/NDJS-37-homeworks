import { Router } from 'express'

import userRoute from './user.route.js'
import homeRoute from './home.route.js'
import bookRoute from './book.route.js'

const router = Router()

router.use('/', homeRoute)
router.use('/user', userRoute)
router.use('/book', bookRoute)

export default router