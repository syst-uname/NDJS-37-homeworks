import express from "express"
import path from 'path';

import config from '../../config/index.js'
import library from "../../model/library.js"
import multer from "../../config/multer.js"
import counter from '../../service/counter.service.js'

const router = express.Router()

router.use(express.static(path.join(config.server.dirname, 'src', 'storage', 'public')));

// все книги  
router.get('/', (req, res) => {
  res.render('book/index', {
    title: 'Список книг',
    books: library.getAll()
  })
})

// создание книги
router.get('/create', (req, res) => {
  res.render('book/create', {
    title: 'Добавление книги',
    books: library.getAll(),
    book: {}
  })
})

router.post('/create',
  multer.fields([{ name: 'fileCover' }, { name: 'fileBook' }]),
  (req, res) => {
    library.add(req.body, req.files)
    res.redirect('/view/books')
  }
)

// конкретная книга
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const book = await library.get(id)
  if (book) {
    counter.incr(id)       // увеличиние счетчика просмотров
    res.render('book/view', {
      title: 'Просмотр книги',
      books: library.getAll(),
      book: book
    })
  } else {
    res.redirect('/view/404')
  }
})

// изменение книги
router.get('/update/:id', async (req, res) => {
  const book = await library.get(req.params.id)
  if (book) {
    res.render('book/update', {
      title: 'Редактирование книги',
      books: library.getAll(),
      book: book
    })
  } else {
    res.redirect('/view/404')
  }
})

router.post('/update/:id',
  multer.fields([{ name: 'fileCover' }, { name: 'fileBook' }]),
  (req, res) => {
    library.update(req.params.id, req.body, req.files)
    res.redirect('/view/books/' + req.params.id)
  }
)

// удаление книги (приходится делать через GET)
router.get('/delete/:id', (req, res) => {
  if (library.delete(req.params.id)) {
    res.redirect('/view/books')
  } else {
    res.render('errors/not-found-book', {
      title: 'Книга не найдена',
      books: library.getAll()
    })
  }
})

// скачивание файла книги
router.get('/:id/download', async (req, res) => {
  const book = await library.get(req.params.id)
  if (book) {
    res.download(
      path.join('src', 'storage', 'public', book.fileNameBook),
      book.fileOriginalBook,
      (err) => {
        if (err) {
          res.render('errors/not-found-book', {
            title: 'Книга не найдена',
            books: library.getAll()
          })
        }
      })
  } else {
    res.render('errors/not-found-book', {
      title: 'Книга не найдена',
      books: library.getAll()
    })
  }
})

export default router