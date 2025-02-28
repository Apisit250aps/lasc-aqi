import { Request, Response } from 'express'
import devices from '../../models/devices'

export default async function (req: Request, res: Response) {
  try {
    const device = await devices.find().toArray()
    res.json({
      success: true,
      message: 'Devices fetched successfully',
      data: device
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}
