import { Request, Response } from 'express'
import { isRequestView } from '../utils'

export const error404 = async (req: Request, res: Response) => {
    if (isRequestView(req)) {
        res.render('errors/error', {
            user: req.user,
            error: 'Страница не найдена',
        })
    } else {
        res.status(404).json({ error: 'Not found' })
    }
}