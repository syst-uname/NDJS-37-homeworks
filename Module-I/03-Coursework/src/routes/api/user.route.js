import { Router } from 'express'

import passport from '../../config/passport.js'
import { authenticateUser } from '../../middleware/index.js'
import { UserService } from '../../services/index.js'

const router = Router()

// аутентификация
router.post('/signin',
  passport.authenticate('local', { failureMessage: true, failWithError: true }),
  (req, res) => {
    res.status(200).json({
      data: req.user,
      status: 'ok',
    })
  }
)

// выход
router.post('/logout',
  authenticateUser,
  (req, res) => {
    req.logout(() => { })
    res.status(200).json({
      message: 'Вы вышли из системы',
      status: 'ok',
    })
  }
)

// регистрация
router.post('/signup',
  async (req, res) => {
    try {
      const user = await UserService.create(req.body)
      res.status(201).json({
        data: user,
        status: 'ok',
      })
    } catch (error) {
      res.status(error.status).json({
        error: error.message,
        status: 'error',
      })
    }
  }
)

export default router