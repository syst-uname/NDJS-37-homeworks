import { Router } from "express"
import store from "../model/store.js"
import multer from "../config/multer.js"


const router = Router()

// все книги 
router.get('/', (req, res) => {
  res.json(store.getAll())
})

// конкретная книга
router.get('/:id', (req, res) => {
  const book = store.get(req.params.id)
  if (book) {
    res.json(book)
  } else {
    res.status(404)
    res.json(`Книга ${req.params.id} не найдена`)
  }
})

// добавление книги
router.post('/',
  multer.single('fileBook'),
  (req, res) => {
    const book = store.add(req.body, req.file)
    if (book) {
      res.json(book)
    } else {
      res.status(404)
      res.json(`Книга не создана`)
    }
  })

// редактирование книги
router.put('/:id', (req, res) => {
  const book = store.update(req.params.id, req.body)
  if (book) {
    res.json(book)
  } else {
    res.status(404)
    res.json(`Книга ${req.params.id} не найдена`)
  }
})

// удаление книги
router.delete('/:id', (req, res) => {
  if (store.delete(req.params.id)) {
    res.json(`Книга ${req.params.id} удалена`)
  } else {
    res.status(404)
    res.json(`Книга ${req.params.id} не найдена`)
  }
})

// скачивание файла книги
router.get('/:id/download', (req, res) => {
  const book = store.get(req.params.id)
  if (book) {
    res.download(book.fileBook, book.fileName, (err) => {
      if (err) {
        res.status(404)
        res.json(`Файл ${book.fileName} не найден`)
      }
    })
  } else {
    res.status(404)
    res.json(`Книга ${req.params.id} не найдена`)
  }
})

export default router