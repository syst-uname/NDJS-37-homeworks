import { Router } from "express"
import library from "../../../services/library.js"
import multer from "../../../config/multer.js"

const router = Router()

// все книги 
router.get('/', async (req, res) => {
  try {
    const books = await library.getAll()
    res.json(books)
  } catch (error) {
    res.status(404).json({ error: `Ошибка при получении книг: ${error}` })
  }
})

// конкретная книга
router.get('/:id', async (req, res) => {
  try {
    const book = await library.get(req.params.id)
    res.json(book)
  } catch (error) {
    res.status(404).json({ error: `Ошибка при получении книги ${req.params.id}: ${error}` })
  }
})

// добавление книги
router.post('/',
  multer.single('fileBook'),
  async (req, res) => {
    try {
      const book = await library.add(req.body, req.file)
      res.json(book)
    } catch (error) {
      res.status(404).json({ error: `Ошибка при добавлении книги: ${error}` })
    }
  })

// редактирование книги
router.put('/:id', async (req, res) => {
  try {
    const result = await library.update(req.params.id, req.body)
    res.json(result)
  } catch (error) {
    res.status(404).json({ error: `Ошибка при редактировании книги ${req.params.id}: ${error}` })
  }
})

// удаление книги
router.delete('/:id', async (req, res) => {
  try {
    await library.delete(req.params.id)
    res.json(`Книга ${req.params.id} удалена`)
  } catch (error) {
    res.status(404).json({ error: `Ошибка при удалении книги ${req.params.id}: ${error}` })
  }
})

// скачивание файла книги
router.get('/:id/download', async (req, res) => {
  try {
    const book = await library.get(req.params.id)
    res.download(book.fileBook, book.fileName, (err) => {
      if (err) {
        res.status(404).json({ error: `Файл ${book.fileName} не найден` })
      }
    })
  } catch (error) {
    res.status(404).json({ error: `Ошибка при скачивании книги ${req.params.id}: ${error}` })
  }
})

export default router