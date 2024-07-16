import multer from "multer"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const fileName = `${req.body.authors} - ${file.originalname}`
    cb(null, fileName)
  }
})

export default multer({ storage })