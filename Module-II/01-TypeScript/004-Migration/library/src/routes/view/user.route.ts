import { Router } from 'express'

import { BookService, UserService } from '../../services'
import { authenticateUser } from '../../middleware'
import { container, passport } from '../../infrastructure'

const bookService = container.get(BookService)
const userService = container.get(UserService)

const router = Router()

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
        res.render('user/profile', {
            title: 'Профиль',
            user: req.user,
            count: await bookService.count(),
            profile: req.user,
            toast: ''
        })
    }
)

router.get('/profile/:username',
    authenticateUser,
    async (req, res) => {
        try {
            res.render('user/profile', {
                title: 'Профиль',
                user: req.user,
                count: await bookService.count(),
                profile: await userService.find(req.params.username),
                toast: ''
            })
        } catch (error) {
            res.render('errors/error', {
                user: req.user,
                error: error.message
            })
        }
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
        const result = await userService.registration(req.body)
        req.session.messageUserSignup = result.message           // отобразится на новой странице
        res.redirect('/view/user/login')
    } catch (error) {
    // перерисовываем страницу с теми же данными и ошибкой
        res.render('user/signup', {
            title: 'Регистрация',
            user: req.user,
            defaults: req.body,
            count: await bookService.count(),
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