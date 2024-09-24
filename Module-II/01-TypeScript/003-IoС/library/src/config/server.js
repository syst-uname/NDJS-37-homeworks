import path from 'path';
import { fileURLToPath } from 'url';

const server = {
  dirname: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..',),      // путь к корневой папке проекта
  publicDir: path.join('src', 'storage', 'public'),
  port: process.env.PORT || 3000,
}

export default server