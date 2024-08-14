import { Router } from "express";
import LibraryService from "../../services/library.service.js"

const router = Router();

// главная страница
router.get('/', async (req, res) => {
  res.render('index', {
    title: 'Главная страница',
    user: req.user,
    count: await LibraryService.count(),
    content: await LibraryService.titleContent(),
    toast: ''
  })
})


export default router