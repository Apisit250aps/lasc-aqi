import { MongoClient, Db } from 'mongodb'
import config from './config'

const uri = config.mongoURI as string // Change to your MongoDB URI
const client = new MongoClient(uri)

export const connectDB = async () => {
  try {
    await client.connect()
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

const db = client.db()
export default db
