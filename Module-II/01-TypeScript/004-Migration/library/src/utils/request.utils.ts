import { Request } from 'express'

export const isRequestView = (req: Request) => {
    // пока не знаю как лучше отделять запросы к api от view 
    return req.originalUrl.startsWith('/view/')
}