import bcrypt from 'bcrypt'
import config from '../config'

export async function hashPassword(password: string) {
    const saltRounds = config.auth.salt_rounds
    const hash = await bcrypt.hash(password, saltRounds)
    return hash
}

export async function verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}
