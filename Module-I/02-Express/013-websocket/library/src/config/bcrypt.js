import bcrypt from 'bcrypt'

export async function hashPassword(password) {
  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)
  return hash
}

export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash)
}
