import { Request, Response } from 'express'
import { isReqView } from '../utils'

const error = async (err: Error, req: Request, res: Response) => {
    const view = isReqView(req)

    // ошибки аутентификации из пасорта 
    if (err.name === 'AuthenticationError') {
        const message = req.session.messages.join('')
        req.session.messages = []
        if (view) {
            res.render('user/login', {
                title: 'Аутентификация',
                user: req.user,
                defaults: req.body,
                count: 0,
                message,
                toast: ''
            })
        } else {
            res.status(400).json({ message })
        }
    } else {
        const message = err.message + ' ' + err.stack
        if (view) {
            res.render('errors/error', {
                user: req.user,
                error: message,
            })
        } else {
            res.status(500).json({ error: message })
        }
    }
}

export default error