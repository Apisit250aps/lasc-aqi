import { devices } from '@/models'
import { IResponse } from '@/types/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse<IResponse>> {
  try {
    const { name, location } = await req.json()
    if (!name || !location) {
      return NextResponse.json(
        {
          success: false,
          message: 'Required parameters'
        },
        { status: 400 }
      )
    }

    const unique = await devices.findOne({ $and: [{ name }, { location }] })
    if (unique) {
      return NextResponse.json(
        {
          success: false,
          message: 'Device already exists'
        },
        { status: 400 }
      )
    }

    await devices.insertOne({
      name,
      location,
      createdAt: new Date()
    })
    return NextResponse.json(
      {
        success: true,
        message: 'Device created successfully'
      },
      {
        status: 201
      }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        success: false,
        message: 'Server error'
      },
      {
        status: 500
      }
    )
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract pagination parameters from URL
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    const [data, totalDocs] = await Promise.all([
      devices.find({}).skip(skip).limit(limit).toArray(),
      devices.countDocuments({})
    ])
    const totalPages = Math.ceil(totalDocs / limit)
    return NextResponse.json({
      success: true,
      message: 'Devices fetched successfully',
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
      {
        success: false,
        message: 'Server error'
      },
      {
        status: 500
      }
    )
  }
}