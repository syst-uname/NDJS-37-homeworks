import mongoose from 'mongoose'
import config from '../config/index.js'

const connectToDatabase = async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongo.url)
  } catch (error) {
    console.error(error)
  }
}

export default connectToDatabase
