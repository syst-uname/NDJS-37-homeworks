import { model, Schema } from 'mongoose'

const messageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sentAt: { type: Date, default: Date.now, required: true },
  text: { type: String, required: true },
  readAt: { type: Date },
})

const chatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  createdAt: { type: Date, default: Date.now, required: true },
  messages: [messageSchema],
})

export const ChatModel = model('Chat', chatSchema)
export const MessageModel = model('Message', messageSchema)