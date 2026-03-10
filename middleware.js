import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((request) => {
    const { pathname } = request.nextUrl;

    // Protect all /admin routes except /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        if (!request.auth) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/admin/:path*'],
};
