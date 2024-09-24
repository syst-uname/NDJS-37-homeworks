import { Router } from "express";

import container from "../../config/container.js";
import { BookRepository, CommentRepository } from "../../repositories/index.js"

const bookRepository = container.get(BookRepository)
const commentRepository = container.get(CommentRepository)

const router = Router();

// главная страница
router.get('/', async (req, res) => {
  try {
    res.render('index', {
      title: 'Главная страница',
      user: req.user,
      count: await bookRepository.count(),
      content: await bookRepository.titleContent(),
      comments: await commentRepository.get('index'),
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