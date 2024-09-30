import express from 'express'
import path from 'path'

import { container } from '../../infrastructure/container'
import { authenticateUser } from '../../middleware'
import { BookRepository, CommentRepository, CounterRepository } from '../../repositories'
import config from '../../config'
import multer from '../../infrastructure/multer'

const bookRepository = container.get(BookRepository)
const commentRepository = container.get(CommentRepository)
const counterRepository = container.get(CounterRepository)

const router = express.Router()

router.use(authenticateUser)

// все книги  
router.get('/', async (req, res) => {
    try {
        const toast = req.session.messageBook
        req.session.messageBook = ''

        res.render('book/index', {
            title: 'Все книги',
            user: req.user,
            count: await bookRepository.count(),
            books: await bookRepository.getAll(),
            toast: toast
        })
    } catch (error) {
        res.render('errors/error', {
            user: req.user,
            error: error.message,
        })
    }
})

// создание книги
router.get('/create', async (req, res) => {
    try {
        res.render('book/create', {
            title: 'Добавление книги',
            user: req.user,
            count: await bookRepository.count(),
            book: {},
            toast: ''
        })
    } catch (error) {
        res.render('errors/error', {
            user: req.user,
            error: error.message,
        })
    }
})

router.post('/create',
    multer.fields([{ name: 'fileCover' }, { name: 'fileBook' }]),
    async (req, res) => {
        try {
            await bookRepository.add(req.body, req.files)
            req.session.messageBook = `Книга "${req.body.title}" добавлена`
            res.redirect('/view/book')
        } catch (error) {
            res.render('errors/error', {
                user: req.user,
                error: error.message,
            })
        }
    }
)

// конкретная книга
router.get('/:id', async (req, res) => {
    try {
        const book = await bookRepository.get(req.params.id)
        counterRepository.incr(req.params.id)      // счетчик просмотров книги

        res.render('book/view', {
            title: 'Просмотр книги',
            user: req.user,
            count: await bookRepository.count(),
            book: book,
            comments: await commentRepository.get(req.params.id),
            toast: ''
        })
    } catch (error) {
        res.render('errors/error', {
            user: req.user,
            error: error.message,
        })
    }
})

// изменение книги
router.get('/update/:id', async (req, res) => {
    try {
        const book = await bookRepository.get(req.params.id)
        res.render('book/update', {
            title: 'Редактирование книги',
            user: req.user,
            count: await bookRepository.count(),
            book: book,
            toast: ''
        })
    } catch (error) {
        res.render('errors/error', {
            user: req.user,
            error: error.message
        })
    }
})

router.post('/update/:id',
    multer.fields([{ name: 'fileCover' }, { name: 'fileBook' }]),
    async (req, res) => {
        try {
            await bookRepository.update(req.params.id, req.body, req.files)
            res.redirect('/view/book/' + req.params.id)
        } catch (error) {
            res.render('errors/error', {
                user: req.user,
                error: error.message
            })
        }
    }
)

// удаление книги (приходится делать через GET)
router.get('/delete/:id', async (req, res) => {
    try {
        await bookRepository.delete(req.params.id)
        req.session.messageBook = 'Книга удалена'     // отобразится на новой странице
        res.redirect('/view/book')
    } catch (error) {
        res.render('errors/error', {
            user: req.user,
            error: error.message
        })
    }
})

// скачивание файла книги
router.get('/:id/download', async (req, res) => {
    try {
        const book = await bookRepository.get(req.params.id)
        res.download(
            path.join(config.server.publicDir, book.fileNameBook),
            book.fileOriginalBook,
            (error) => {
                if (error) {
                    res.render('errors/error', {
                        user: req.user,
                        error: error.message
                    })
                }
            }
        )
    } catch (error) {
        res.render('errors/error', {
            user: req.user,
            error: error.message
        })
    }
})

export default router