import { airs } from '@/models'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = await req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('page') || '10')
    const device = searchParams.get('device')
    let query = {}
    if (device) {
      query = { device: new ObjectId(device) }
    }
    const [data, totalDocs] = await Promise.all([
      airs
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      airs.countDocuments(query)
    ])
    const totalPages = Math.ceil(totalDocs / limit)
    return NextResponse.json({
      success: true,
      message: 'Airs fetched successfully',
      data,
      pagination: {
        totalPages,
        totalDocs,
        limit,
        page
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
