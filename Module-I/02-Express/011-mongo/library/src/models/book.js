import { model, Schema } from "mongoose"

const bookSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  authors: { type: String, required: true },
  description: { type: String, required: true },
  favorite: { type: Number, default: 0 },
  fileNameCover: { type: String, required: true },
  fileOriginalCover: { type: String, required: true },
  fileNameBook: { type: String, required: true },
  fileOriginalBook: { type: String, required: true },
})

const Book = model('Book', bookSchema)

export default Book