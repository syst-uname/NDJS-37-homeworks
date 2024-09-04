import path from 'path'
import { fileURLToPath } from 'url'

const server = {
  dirname: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..',),      // путь к корневой папке проекта
  publicDir: path.join('src', 'storage', 'public'),
  uploadsDir: path.join('src', 'storage', 'uploads'),
  port: process.env.PORT || 3000,
}

export default server