const auth = {
  sessionSecret: process.env.AUTH_SESSION_SECRET || 'session_secret',
  jwtSecret: process.env.JWT_SECRET || 'jwt_secret',
  jwtExpires: process.env.JWT_EXPIRES || '60s',
  saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '2'),
}

export default auth