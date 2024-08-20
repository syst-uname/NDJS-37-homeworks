import path from 'path';
import { fileURLToPath } from 'url';

const server = {
  dirname: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..',),      // путь к корневой папке проекта
  port: process.env.PORT || 3002,
}

export default server