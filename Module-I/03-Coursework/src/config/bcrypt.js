import bcrypt from 'bcrypt'
import config from './index.js'

export async function hashPassword(password) {
  const saltRounds = config.auth.salt_rounds
  const hash = await bcrypt.hash(password, saltRounds)
  return hash
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash)
}
