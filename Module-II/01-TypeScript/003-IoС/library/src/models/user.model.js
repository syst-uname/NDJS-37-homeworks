import { model, Schema } from "mongoose"

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now },
})

const UserModel = model('User', userSchema)

export default UserModel