import { Router } from "express"
import { passport } from "../infrastructure/passport.js"
import { authenticateUser } from "../middleware/authenticate.js"

export const router = Router()

router.get('/', (req, res) => {
  res.render('index', { user: req.user })
})

router.get('/profile',
  authenticateUser,
  (req, res) => {
    res.render('profile', { user: req.user })
  }
)

router.get('/login',
  passport.authenticate('yandex')
)

router.get('/logout',
  authenticateUser,
  (req, res) => {
    req.logout(() => { })
    res.redirect('/')
  }
)

router.get('/auth/yandex/callback',
  passport.authenticate('yandex', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile')
  }
)