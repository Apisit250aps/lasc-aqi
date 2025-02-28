import { Request, Response } from 'express'
import devices from '../../models/devices'

export default async function (req: Request, res: Response): Promise<void> {
  try {
    const { name, location } = req.body
    if (!name || !location) {
      res.status(400).json({
        success: false,
        message: 'Invalid input'
      })
      return
    }
    const unique = await devices.findOne({ $and: [{ name }, { location }] })
    if (unique) {
      res.status(400).json({
        success: false,
        message: 'Device already exists'
      })
      return
    }
    // Create device
    const newDevice = await devices.insertOne({
      name,
      location,
      createdAt: new Date()
    })
    if (!newDevice.acknowledged) {
      res.status(500).json({
        success: false,
        message: 'Failed to create device'
      })
      return
    }
    const createdDevice = await devices.findOne({ _id: newDevice.insertedId })
    if (!createdDevice) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch created device'
      })
      return
    }
    res.json({
      success: true,
      message: 'Device created successfully',
      data: createdDevice
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}
