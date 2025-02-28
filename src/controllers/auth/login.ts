import { Request, Response } from 'express'
import users from '../../models/users'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import config from '../../config'
export default async function login(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, password } = req.body
    const user = await users.findOne({
      name
    })
    if (!user) {
      res.status(400).json({
        success: false,
        message: 'User not found'
      })
      return
    }
    const validPassword = argon2.verify(user.password as string, password)
    if (!validPassword) {
      res.status(400).json({
        success: false,
        message: 'Invalid password'
      })
      return
    }
    const token = jwt.sign(user, config.jwtSecret as string, {
      expiresIn: '1d'
    })
    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token
      }
    })
  } catch (error) {}
}
