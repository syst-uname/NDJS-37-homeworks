import path from 'path'

const server = {
    dirname: process.cwd(),      // путь к корневой папке проекта
    publicDir: path.join('src', 'storage', 'public'),
    port: process.env.PORT || 3000,
}

export default server