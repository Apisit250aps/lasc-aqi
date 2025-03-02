import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// Use environment variable for secret, with fallback for development
const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  try {
    // Try to get the token, handle potential errors
    const token = await getToken({ 
      req, 
      secret,
      // Secure against token security issues
      secureCookie: process.env.NODE_ENV === 'production'
    })

    // Admin route protection
    if (pathname.startsWith('/admin')) {
      // No token, redirect to login
      if (!token) {
        const loginUrl = new URL('/auth', req.url)
        // Preserve the original URL to redirect back after login
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
      
      // Has token but not admin role
      if (token.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Protected routes check - add any other protected routes here
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
      if (!token) {
        const loginUrl = new URL('/auth', req.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // Fallback to login page in case of errors
    return NextResponse.redirect(new URL('/auth', req.url))
  }
}

// Update the matcher to be more precise and exclude public resources
export const config = {
  matcher: [
    // Protected routes
    '/admin/:path*', 
    // Add other routes that need protection
    
    // Exclude public resources and Next.js internals
    '/((?!api|_next/static|_next/image|images|favicon.ico|public).*)'
  ]
}