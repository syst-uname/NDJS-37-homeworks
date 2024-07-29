import path from 'path';
import { fileURLToPath } from 'url';

const server = {
  dirname: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..',),      // путь к корневой папке проекта
  port: process.env.PORT || 3002,
  counter_url: process.env.COUNTER_URL || 'http://counter:3001',
}

export default server