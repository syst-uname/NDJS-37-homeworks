import mongoose from 'mongoose'
import config from '../config'

export const connectToDatabase = async function connectToDatabase() {
    try {
        await mongoose.connect(config.mongo.url)
    } catch (error) {
        console.error(error)
    }
}