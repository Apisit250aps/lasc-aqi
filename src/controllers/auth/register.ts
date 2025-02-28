import argon2 from 'argon2'
import { Request, Response } from 'express'
import users from '../../models/users'
export interface IResponse<T = any> {
  succuss: boolean
  message: string
  data?: T
}

export default async function register(
  req: Request,
  res: Response<IResponse>
): Promise<void> {
  try {
    // Simulated registration logic
    const { name, password } = req.body
    const hashedPassword = await argon2.hash(password)

    const unique = await users.findOne({ $or: [{ name }] })
    if (unique) {
      res.status(400).json({
        succuss: false,
        message: 'Name is already taken'
      })
      return
    }
    const newUser = await users.insertOne({
      name,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    })
    res.status(201).json({
      succuss: true,
      message: 'User registered successfully',
      data: {
        _id: newUser.insertedId,
        name,
        role: 'admin',
        createdAt: new Date()
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      succuss: false,
      message: 'An error occurred while registering'
    })
    return
  }
}
