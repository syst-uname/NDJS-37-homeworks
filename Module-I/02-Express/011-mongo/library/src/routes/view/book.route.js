import express from "express"
import path from 'path';

import library from "../../services/library.js"
import counter from '../../services/counter.js'
import config from '../../config/index.js'
import multer from "../../config/multer.js"

const router = express.Router()

router.use(express.static(path.join(config.server.dirname, 'src', 'storage', 'public')));

// все книги  
router.get('/', async (req, res) => {
  try {
    res.render('book/index', {
      title: 'Список книг',
      count: await library.count(),
      books: await library.getAll()
    })
  } catch (error) {
    res.redirect('/view/error')
  }
})

// создание книги
router.get('/create', async (req, res) => {
  try {
    res.render('book/create', {
      title: 'Добавление книги',
      count: await library.count(),
      book: {}
    })
  } catch (error) {
    res.redirect('/view/error')
  }
})

router.post('/create',
  multer.fields([{ name: 'fileCover' }, { name: 'fileBook' }]),
  async (req, res) => {
    try {
      await library.add(req.body, req.files)
      res.redirect('/view/book')
    } catch (error) {
      res.status(404).json({ error: `Ошибка при добавлении книги: ${error}` })
    }
  }
)

// конкретная книга
router.get('/:id', async (req, res) => {
  try {
    const book = await library.get(req.params.id)
    counter.incr(req.params.id)       // увеличение счетчика просмотров
    res.render('book/view', {
      title: 'Просмотр книги',
      count: await library.count(),
      book: book
    })
  } catch (error) {
    res.redirect('/view/error/not_found_book')
  }
})

// изменение книги
router.get('/update/:id', async (req, res) => {
  try {
    const book = await library.get(req.params.id)
    res.render('book/update', {
      title: 'Редактирование книги',
      count: await library.count(),
      book: book
    })
  } catch (error) {
    res.redirect('/view/error')
  }
})

router.post('/update/:id',
  multer.fields([{ name: 'fileCover' }, { name: 'fileBook' }]),
  async (req, res) => {
    try {
      await library.update(req.params.id, req.body, req.files)
      res.redirect('/view/book/' + req.params.id)
    } catch (error) {
      res.redirect('/view/error')
    }
  }
)

// удаление книги (приходится делать через GET)
router.get('/delete/:id', async (req, res) => {
  try {
    await library.delete(req.params.id)
    res.redirect('/view/book')
  } catch (error) {
    res.redirect('/view/error')
  }
})

// скачивание файла книги
router.get('/:id/download', async (req, res) => {
  try {
    const book = await library.get(req.params.id)
    res.download(
      path.join('src', 'storage', 'public', book.fileNameBook),
      book.fileOriginalBook,
      async (error) => {
        if (error) {
          res.redirect('/view/error/not_found_book')
        }
      }
    )
  } catch (error) {
    res.redirect('/view/error/not_found_book')
  }
})

export default router