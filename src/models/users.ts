import { Document } from 'mongodb'
import db from '../db'

export interface IUser extends Document {
  name: string
  password?: string
  lastLogin?: Date
  role: 'admin' | 'staff' | 'device'
  updatedAt?: Date
  createdAt?: Date
}
const users = db.collection<IUser>('users')
export default users