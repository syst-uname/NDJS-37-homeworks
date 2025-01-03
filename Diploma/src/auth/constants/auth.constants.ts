/** Роли пользователя */
export enum ROLE {
  CLIENT = 'client',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

/** Ключ JWT в куки */
export const COOKIE_TOKEN = 'token'

/** Метаданные ролей */
export const METADATA_ROLES = 'roles'