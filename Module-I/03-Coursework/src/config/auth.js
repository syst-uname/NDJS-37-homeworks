const auth = {
  session_secret: process.env.AUTH_SESSION_SECRET || 'secret',
  salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 2,
}

export default auth