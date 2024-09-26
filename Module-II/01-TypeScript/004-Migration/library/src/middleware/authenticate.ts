import { isReqView } from '../utils/util.js'

const authenticateUser = (req, res, next) => {
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