import mongoose from 'mongoose'
import config from '../config/index.js'

export async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongo.url)
  } catch (error) {
    console.error(error)
  }
}
