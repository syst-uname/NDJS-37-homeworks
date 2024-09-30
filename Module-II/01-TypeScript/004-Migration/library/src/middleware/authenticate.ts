import { NextFunction, Request, Response } from 'express'
import { isReqView } from '../utils/util'

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        if (isReqView(req)) {
            res.redirect('/view')
        } else {
            res.status(401).json({ error: 'Unauthorized' })
        }
    }
}

export default authenticateUser