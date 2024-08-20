import { Router } from "express";
import LibraryService from "../../services/library.service.js"
import CommentService from "../../services/comment.service.js"

const router = Router();

// главная страница
router.get('/', async (req, res) => {
  try {
    res.render('index', {
      title: 'Главная страница',
      user: req.user,
      count: await LibraryService.count(),
      content: await LibraryService.titleContent(),
      comments: await CommentService.get('index'),
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