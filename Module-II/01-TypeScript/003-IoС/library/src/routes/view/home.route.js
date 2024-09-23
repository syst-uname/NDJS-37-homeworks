import { Router } from "express";
import { BookRepository, CommentRepository } from "../../repositories/index.js"

const router = Router();

// главная страница
router.get('/', async (req, res) => {
  try {
    res.render('index', {
      title: 'Главная страница',
      user: req.user,
      count: await BookRepository.count(),
      content: await BookRepository.titleContent(),
      comments: await CommentRepository.get('index'),
      toast: ''
    })
  } catch (error) {
    res.render('errors/error', {
      user: req.user,
      error: error.message,
    })
  }
})

export default router