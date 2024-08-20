import path from 'path';
import { fileURLToPath } from 'url';

const server = {
  dirname: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..',),      // путь к корневой папке проекта
  port: process.env.SERVER_PORT || 3000
}

export default server