import { Router } from "express";

import passport from '../../config/passport.js';
import LibraryService from "../../services/library.service.js";
import UserService from "../../services/user.service.js";
import authenticateUser from "../../middleware/authenticate.js";

const router = Router();

// роуты пользователя
router.get('/login', async (req, res) => {
  const toast = req.session.messageUserSignup      // возможно сообщение об успешной регистрации
  req.session.messageUserSignup = ''

  res.render('user/login', {
    title: 'Аутентификация',
    user: req.user,
    defaults: {},
    count: 0,
    message: '',
    toast: toast
  })
})

router.post('/login',
  passport.authenticate('local', { failureMessage: true, failWithError: true }),
  async (req, res) => {
    res.redirect('/view')
  }
)

router.get('/me',
  authenticateUser,
  async (req, res) => {
    res.render('user/me', {
      title: 'Профиль',
      user: req.user,
      count: await LibraryService.count(),
      toast: ''
    })
  }
)

router.get('/signup', async (req, res) => {
  res.render('user/signup', {
    title: 'Регистрация',
    user: req.user,
    defaults: {},
    count: 0,
    message: '',
    toast: ''
  })
})

router.post('/signup', async (req, res) => {
  try {
    const result = await UserService.registration(req.body)
    req.session.messageUserSignup = result.message           // отобразится на новой странице
    res.redirect('/view/user/login')
  } catch (error) {
    // перерисовываем страницу с теми же данными и ошибкой
    res.render('user/signup', {
      title: 'Регистрация',
      user: req.user,
      defaults: req.body,
      count: await LibraryService.count(),
      message: error.message,
      toast: ''
    })
  }
})

router.get('/logout',
  authenticateUser,
  (req, res) => {
    req.logout(() => { })
    res.redirect('/view')
  }
)

export default router