import { Router } from 'express'
import { default as homeRoute } from './home.route.js'
import { default as booksRoute } from './book.route.js'
import { default as errorRoute } from './error.route.js'

const router = Router()

router.use('/', homeRoute)
router.use('/books', booksRoute)
router.use('/error', errorRoute)

export default router