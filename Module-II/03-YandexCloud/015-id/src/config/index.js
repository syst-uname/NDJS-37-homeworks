export const config = {
  port: process.env.PORT || 3000,
  cookieSecret: process.env.COOKIE_SECRET || 'secret',
  clientID: process.env.YANDEX_CLIENT_ID,
  clientSecret: process.env.YANDEX_CLIENT_SECRET,
  callbackURL: process.env.YANDEX_CALLBACK_URL,
}
