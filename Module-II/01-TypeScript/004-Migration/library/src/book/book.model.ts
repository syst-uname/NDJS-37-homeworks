import { Document, model, Schema } from 'mongoose'
import { IBook } from './book.interface'

const schema = new Schema({
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

export const BookModel = model<IBook & Document>('Book', schema)