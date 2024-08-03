import { Router } from "express";
import library from "../../models/library.js"

const router = Router();

// главная страница
router.get('/', (req, res) => {
  res.render('index',
    {
      title: 'Главная страница',
      books: library.getAll()
    }
  )
})

export default router