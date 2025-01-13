import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // List of public paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup']

  // Check if the requested path is public
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith('/api/')
  )

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token) {
    try {
      await verify(token)
      // If the token is valid and the user is trying to access login or signup, redirect to dashboard
      if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch {
      // If token is invalid, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (inside public directory)
     * 4. /images/* (inside public directory)
     * 5. /favicon.ico, /site.webmanifest (favicon files)
     */
    '/((?!api/auth|_next|fonts|images|favicon.ico|site.webmanifest).*)',
  ],
}

