import { Request, Response } from 'express'

export default async function (req: Request, res: Response) {
  res.render('admin', {
    title: 'Express EJS TypeScript',
    message: 'Hello from Express with EJS and TypeScript!'
  })
}
