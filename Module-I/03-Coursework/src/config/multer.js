import multer from "multer"
import server from "./server.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, server.publicDir)
  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'binary').toString('utf8');
    const fileName = `${req.body.authors} - ${file.originalname}`
    cb(null, fileName)
  }
})

export default multer({ storage })