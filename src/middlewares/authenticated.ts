import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token // ดึง token จาก Cookie

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret as string)
    ;(req as any).user = decoded // เก็บข้อมูลผู้ใช้ไว้ใน req
    next() // ดำเนินการต่อไปยัง route ถัดไป
  } catch {
    res.status(403).json({ message: 'Forbidden: Invalid token' })
  }
}
