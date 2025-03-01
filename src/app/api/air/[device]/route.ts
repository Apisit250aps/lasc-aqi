import { airs, devices } from '@/models'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ device: string }> }
): Promise<NextResponse> {
  try {
    const { device } = await params
    const data = await req.json()
    console.log(data, device)
    const deviceData = await devices.findOne({ _id: new ObjectId(device) })
    if (!deviceData) {
      return NextResponse.json(
        { success: false, message: 'Device not found' },
        { status: 404 }
      )
    }
    await airs.insertOne({
      ...data,
      device: new ObjectId(device),
      createdAt: new Date()
    })
    return NextResponse.json(
      { success: true, message: 'Air created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}