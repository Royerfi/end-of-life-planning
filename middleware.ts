import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/signin' || request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token || token.trim() === '') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  try {
    const { payload }: { payload: Record<string, any> } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    console.log('Token verified successfully:', payload);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user', JSON.stringify(payload));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error: any) {
    console.error('Token verification failed:', error?.message || error);
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|signin|api/).*)',
  ],
};
