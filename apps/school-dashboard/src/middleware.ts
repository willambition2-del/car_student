import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/forgot-password');
  const isForceChangePage = pathname.startsWith('/force-change-password');
  
  if (!token) {
    if (!isAuthPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  let mustChangePassword = false;
  try {
    const secretStr = process.env.JWT_ACCESS_SECRET || 'your-access-secret-min-32-chars-here';
    const secret = new TextEncoder().encode(secretStr);
    
    const { payload } = await jwtVerify(token, secret);
    mustChangePassword = payload.mustChangePassword === true;
    
    // Strict RBAC: Only school users can access the school dashboard
    if (payload.userType !== 'school') {
      const response = NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
      response.cookies.delete('token');
      return response;
    }

  } catch (e) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }

  if (mustChangePassword && !isForceChangePage && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/force-change-password', request.url));
  }

  if (!mustChangePassword && isForceChangePage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
