import * as bcrypt from 'bcrypt'
import config from 'src/config'

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, config.auth.salt_rounds)
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}
