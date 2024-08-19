import { model, Schema } from "mongoose"

const commentSchema = new Schema({
  parent: { type: String, required: true },   // на чем висит коммент
  username: { type: String, required: true },
  text: { type: String },
  created: { type: Date, default: Date.now },
})

const CommentModel = model('Comment', commentSchema)

export default CommentModel