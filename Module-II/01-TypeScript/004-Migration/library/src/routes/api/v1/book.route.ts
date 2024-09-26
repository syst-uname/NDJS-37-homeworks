import { Router } from 'express'

import { BookRepository } from '../../../repositories/index.js'
import config from '../../../config/index.js'
import multer from '../../../config/multer.js'
import authenticateUser from '../../../middleware/authenticate.js'
import container from '../../../config/container.js'

const bookRepository = container.get(BookRepository)

const router = Router()

router.use(authenticateUser)

// все книги 
router.get('/', async (req, res) => {
    try {
        const books = await bookRepository.getAll()
        res.status(200).json(books)
    } catch (error) {
        res.status(error.status).json({ error: error.message })
    }
})

// конкретная книга
router.get('/:id', async (req, res) => {
    try {
        const book = await bookRepository.get(req.params.id)
        res.status(200).json(book)
    } catch (error) {
        res.status(error.status).json({ error: error.message })
    }
})

// добавление книги
router.post('/',
    multer.fields([{ name: 'fileCover' }, { name: 'fileBook' }]),
    async (req, res) => {
        try {
            const book = await bookRepository.add(req.body, req.file)
            res.status(201).json(book)
        } catch (error) {
            res.status(error.status).json({ error: error.message })
        }
    }
)

// редактирование книги
router.put('/:id',
    multer.fields([{ name: 'fileCover' }, { name: 'fileBook' }]),
    async (req, res) => {
        try {
            const result = await bookRepository.update(req.params.id, req.body)
            res.status(200).json(result)
        } catch (error) {
            res.status(error.status).json({ error: error.message })
        }
    }
)

// удаление книги
router.delete('/:id', async (req, res) => {
    try {
        await bookRepository.delete(req.params.id)
        res.status(200).json(`Книга ${req.params.id} удалена`)
    } catch (error) {
        res.status(error.status).json({ error: error.message })
    }
})

// скачивание файла книги
router.get('/:id/download', async (req, res) => {
    try {
        const book = await bookRepository.get(req.params.id)
        res.download(
            path.join(config.server.publicDir, book.fileNameBook),
            book.fileOriginalBook,
            (err) => {
                if (err) {
                    res.status(404).json({ error: `Файл ${book.fileName} не найден` })
                }
            })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router