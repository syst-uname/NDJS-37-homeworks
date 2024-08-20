import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/storage/public/')
  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'binary').toString('utf8');
    const fileName = `${req.body.authors} - ${file.originalname}`
    cb(null, fileName)
  }
})

export default multer({ storage })