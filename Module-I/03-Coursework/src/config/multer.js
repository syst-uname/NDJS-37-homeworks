import multer from 'multer'
import server from './server.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, server.uploadsDir)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

export default multer({ storage })