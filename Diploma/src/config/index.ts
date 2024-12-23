import * as dotenv from 'dotenv'
dotenv.config()

import auth from './auth'
import mongo from './mongo'
import server from './server'

const config = {
  auth,
  mongo,
  server,
}

export default config