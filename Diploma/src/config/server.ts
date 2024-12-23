import * as path from 'path'

const server = {
  port: process.env.PORT || 3000,
  publicDir: path.join('public'),
  uploadsHotelsDir: path.join('public', 'uploads', 'hotels'),
}

export default server