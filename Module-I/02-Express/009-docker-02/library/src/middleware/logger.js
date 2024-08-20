import path from 'path';
import fs from 'fs'
import os from 'os'
import config from '../config/index.js';

const logger = (req, res, next) => {
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