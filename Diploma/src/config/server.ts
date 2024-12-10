import * as path from 'path'

const server = {
  port: process.env.PORT || 3000,
  uploadsDirHotels: path.join('uploads', 'hotels'),
}

export default server