const auth = {
  session_secret: process.env.AUTH_SESSION_SECRET || 'session_secret',
  jwt_secret: process.env.JWT_SECRET || 'jwt_secret',
  salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '2'),
}

console.log(`Секретное слово: ${auth.session_secret}`)  // TODO: убрать 
console.log(`Количество шагов: ${auth.salt_rounds}`)

export default auth