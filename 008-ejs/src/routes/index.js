import { Router } from 'express'
import { default as homeRoute } from './home.route.js'
import { default as userRoute } from './user.route.js'
import { default as booksRoute } from './books.route.js'

const router = Router()

router.use('/', homeRoute)
router.use('/user', userRoute)
router.use('/books', booksRoute)

export default router