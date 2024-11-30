const auth = {
  session_secret: process.env.AUTH_SESSION_SECRET || 'session_secret',
  jwt_secret: process.env.JWT_SECRET || 'jwt_secret',
  salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '2'),
}

export default auth