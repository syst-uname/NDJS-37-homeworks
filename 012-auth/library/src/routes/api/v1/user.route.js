import { Router } from "express";

import passport from '../../../config/passport.js';
import UserService from "../../../services/user.service.js";
import authenticateUser from "../../../middleware/authenticate.js";

const router = Router();

// аутентификация
router.post('/login',
  passport.authenticate('local', { failureMessage: true, failWithError: true }),
  (req, res) => {
    res.status(201).json(req.user)
  }
)

// выход
router.post('/logout',
  authenticateUser,
  (req, res) => {
    req.logout(() => { })
    res.status(200).json({ message: 'Вы вышли из системы' })
  }
)

// регистрация
router.post('/signup',
  async (req, res) => {
    try {
      const result = await UserService.registration(req.body)
      res.status(201).json({ message: result.message })
    } catch (error) {
      res.status(error.status).json({ error: error.message })
    }
  }
)

export default router