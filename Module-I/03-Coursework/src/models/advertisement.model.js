import { model, Schema } from 'mongoose'

const schema = new Schema({
  shortText: { type: String, required: true },
  description: { type: String },
  images: { type: [String] },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date },
  tags: { type: [String] },
  isDeleted: { type: Boolean, default: false },
})

const AdvertisementModel = model('Advertisement', schema)

export default AdvertisementModel