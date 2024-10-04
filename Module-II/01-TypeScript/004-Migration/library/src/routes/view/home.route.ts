import { Router } from 'express'

import { container } from '../../infrastructure'
import { BookService } from '../../book/book.service'
import { CommentService } from '../../comment/comment.service'

const bookService = container.get(BookService)
const commentService = container.get(CommentService)

const router = Router()

// главная страница
router.get('/', async (req, res) => {
    try {
        res.render('index', {
            title: 'Главная страница',
            user: req.user,
            count: await bookService.count(),
            content: await bookService.titleContent(),
            comments: await commentService.get('index'),
            toast: ''
        })
    } catch (error) {
        res.render('errors/error', {
            user: req.user,
            error: error.message,
        })
    }
})

export default router