const auth = {
  session_secret: process.env.AUTH_SESSION_SECRET || 'secret',
}

console.log(`Секретное слово: ${auth.session_secret}`)

export default auth