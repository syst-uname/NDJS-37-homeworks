import { Router } from 'express'

import { container, passport } from '../../../infrastructure'
import { authenticateUser } from '../../../middleware'
import { UserService } from '../../../user/user.service'

const userService = container.get(UserService)

const router = Router()

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
            const result = await userService.registration(req.body)
            res.status(201).json({ message: result.message })
        } catch (error) {
            res.status(error.status).json({ error: error.message })
        }
    }
)

// профиль пользователя
router.get('/profile/:username',
    authenticateUser,
    async (req, res) => {
        try {
            const user = await userService.find(req.params.username)
            res.status(200).json({ user })
        } catch (error) {
            res.status(error.status).json({ error: error.message })
        }
    }
)

export default router