import { Router } from 'express'

import userRoute from './user.route'
import homeRoute from './home.route'
import bookRoute from './book.route'

const router = Router()

router.use('/', homeRoute)
router.use('/user', userRoute)
router.use('/book', bookRoute)

export default router