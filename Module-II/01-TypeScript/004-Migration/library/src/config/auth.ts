const auth = {
    session_secret: process.env.AUTH_SESSION_SECRET || 'secret',
    salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '2'),
}

console.log(`Секретное слово: ${auth.session_secret}`)
console.log(`Количество шагов: ${auth.salt_rounds}`)     

export default auth