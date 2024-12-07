/** Ответ при регистрации клиента */
export interface IRegisterClientResponse {
  id: string,
  email: string,
  name: string,
}

/** Ответ при входе */
export interface ILoginResponse {
  email: string,
  name: string,
  contactPhone: string,
}