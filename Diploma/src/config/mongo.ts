const mongo = {
  connection: process.env.MONGO_URL || 'mongodb://localhost:27017/ostrovok',
}

export default mongo