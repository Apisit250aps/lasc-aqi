import { users } from '@/models'
import { IResponse } from '@/types/types'
import argon2 from 'argon2'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse<IResponse>> {
  try {
    const { name, password } = await req.json()
    if (!name || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide all required fields'
        },
        { status: 400 }
      )
    }
    // Check if user exists
    const unique = await users.findOne({ name })
    if (unique) {
      return NextResponse.json(
        {
          success: false,
          message: 'User already exists'
        },
        { status: 400 }
      )
    }

    const hashPassword: string = await argon2.hash(password)

    await users.insertOne({
      name,
      password: hashPassword,
      role: 'admin',
      createdAt: new Date()
    })

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while signing up'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while signing up'
      },
      { status: 500 }
    )
  }
}