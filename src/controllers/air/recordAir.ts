import { Request, Response } from 'express'

export default async function (req: Request, res: Response): Promise<void> {
  try {
    const params = req.params
    res.json({
      success: true,
      message: 'Air quality data fetched successfully',
      data: params
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}
