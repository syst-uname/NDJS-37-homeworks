import { Request, Response } from 'express'
import { isReqView } from '../utils/util'

const error404 = async (req: Request, res: Response) => {
    if (isReqView(req)) {
        res.render('errors/error', {
            user: req.user,
            error: 'Страница не найдена',
        })
    } else {
        res.status(404).json({ error: 'Not found' })
    }
}

export default error404