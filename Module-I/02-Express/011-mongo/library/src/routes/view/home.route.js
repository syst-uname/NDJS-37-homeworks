import { Router } from "express";
import library from "../../services/library.js"

const router = Router();

// главная страница
router.get('/', async (req, res) => {
  res.render('index',
    {
      title: 'Главная страница',
      count: await library.count()
    }
  )
})

export default router