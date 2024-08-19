import express from "express"
import path from 'path';

import authenticateUser from "../../middleware/authenticate.js";
import LibraryService from "../../services/library.service.js"
import CounterService from '../../services/counter.service.js'
import CommentService from "../../services/comment.service.js"
import config from '../../config/index.js'
import multer from "../../config/multer.js"

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
      count: await LibraryService.count(),
      books: await LibraryService.getAll(),
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
      count: await LibraryService.count(),
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
      await LibraryService.add(req.body, req.files)
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
    const book = await LibraryService.get(req.params.id)
    CounterService.incr(req.params.id)      // счетчик просмотров книги

    res.render('book/view', {
      title: 'Просмотр книги',
      user: req.user,
      count: await LibraryService.count(),
      book: book,
      comments: await CommentService.get(req.params.id),
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
    const book = await LibraryService.get(req.params.id)
    res.render('book/update', {
      title: 'Редактирование книги',
      user: req.user,
      count: await LibraryService.count(),
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
      await LibraryService.update(req.params.id, req.body, req.files)
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
    await LibraryService.delete(req.params.id)
    req.session.messageBook = `Книга удалена`     // отобразится на новой странице
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
    const book = await LibraryService.get(req.params.id)
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