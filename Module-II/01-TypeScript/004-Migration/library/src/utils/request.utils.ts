import { Request } from 'express'

const isReqView = (req: Request) => {
    // пока не знаю как лучше отделять запросы к api от view 
    return req.originalUrl.startsWith('/view/')
}

export default isReqView
