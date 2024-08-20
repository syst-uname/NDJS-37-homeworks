import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
import os from 'os'

const logger = (req, res, next) => {
  const data = `${new Date().toLocaleString()} - ${req.method} - ${req.url}` + os.EOL
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  fs.appendFile(
    path.join(__dirname, '..', '..', 'log', 'server.log.txt'),
    data,
    (error) => {
      if (error) throw error
    }
  )

  next()
}

export default logger