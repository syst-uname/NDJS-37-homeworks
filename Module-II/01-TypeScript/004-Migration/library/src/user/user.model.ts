import { Document, model, Schema } from 'mongoose'
import { IUser } from './user.interface'

const schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    created: { type: Date, default: Date.now },
})

export const UserModel = model<IUser & Document>('User', schema)