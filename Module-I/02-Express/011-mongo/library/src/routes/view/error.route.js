import { Router } from "express";
import library from "../../services/library.js"

const router = Router();

// Ошибка
router.get('/', async (req, res) => {
  res.render('errors/error', {
    title: 'Ошибка',
    count: await library.count()
  })
})

// Страница не найдена
router.get('/404', async (req, res) => {
  res.render('errors/404', {
    title: 'Ошибка 404. Страница не найдена',
    count: await library.count()
  })
})

// Книга не найдена
router.get('/not_found_book', async (req, res) => {
  res.render('errors/not-found-book', {
    title: 'Книга не найдена',
    count: await library.count()
  })
})

export default router