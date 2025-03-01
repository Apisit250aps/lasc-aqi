import { Document, ObjectId } from 'mongodb'
import { db } from './client'

export interface IAir extends Document {
  device?: ObjectId | string
  deviceData?: IDevice
  temperature: number
  humidity: number
  pm1: number
  pm25: number
  pm10: number
  createdAt: Date
  updatedAt: Date
}

export interface IDevice extends Document {
  name: string
  location: string
  latitude?: number
  longitude?: number
  updatedAt?: Date
  createdAt?: Date
}

export interface IUser extends Document {
  name: string
  password?: string
  lastLogin?: Date
  role: 'admin' | 'staff' | 'device'
  updatedAt?: Date
  createdAt?: Date
}
export const users = db.collection<IUser>('users')
export const airs = db.collection<IAir>('airs')
export const devices = db.collection<IDevice>('devices')