import dotenv from 'dotenv'

dotenv.config()

const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  mongoURI: process.env.MONGO_URI
}

export default config
