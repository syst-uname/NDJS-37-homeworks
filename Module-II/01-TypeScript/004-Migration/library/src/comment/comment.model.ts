import { Document, model, Schema } from 'mongoose'
import { IComment } from './comment.interface'

const schema = new Schema({
    parent: { type: String, required: true },   // на чем висит коммент
    username: { type: String, required: true },
    text: { type: String },
    created: { type: Date, default: Date.now },
})

export const CommentModel = model<IComment & Document>('Comment', schema)