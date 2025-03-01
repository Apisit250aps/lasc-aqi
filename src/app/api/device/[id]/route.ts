import { devices } from '@/models'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const { name, location } = await req.json()
    if (!name || !location) {
      return NextResponse.json(
        { success: false, message: 'Required parameters' },
        { status: 400 }
      )
    }
    const updated = await devices.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, location } }
    )
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Device not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { success: true, message: 'Device updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const deleted = await devices.deleteOne({ _id: new ObjectId(id) })
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Device not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { success: true, message: 'Device deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
