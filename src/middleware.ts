import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
const secret = process.env.AUTH_SECRET
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const token = await getToken({ req, secret })

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth', req.nextUrl))
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
  }

  return NextResponse.next()
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
