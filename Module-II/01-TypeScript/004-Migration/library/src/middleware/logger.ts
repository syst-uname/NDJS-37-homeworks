import { NextFunction, Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import os from 'os'

import config from '../config'

const logger = (req: Request, res: Response, next: NextFunction) => {
    const data = `${new Date().toLocaleString()} - ${req.method} - ${req.url}` + os.EOL
    fs.appendFile(
        path.join(config.server.dirname, 'src', 'storage', 'log', 'server.log.txt'),
        data,
        (error) => {
            if (error) throw error
        }
    )
    next()
}

export default logger