export const isReqView = (req) => {
    // пока не знаю как лучше отделять запросы к api от view 
    return req.originalUrl.startsWith('/view/')
}

