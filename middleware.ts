import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // // Get token from session storage via headers or cookies
  // const token =
  //   request.cookies.get("auth-token")?.value ||
  //   request.headers.get("authorization")?.replace("Bearer ", "") ||
  //   null;

  // // Define public routes accessible without authentication
  // const publicRoutes = ["/auth/login", "/auth/signup", "/"];
  // const isPublicRoute = publicRoutes.includes(pathname);

  // // Define protected routes (require authentication)
  // const protectedRoutes = ["/dashboard"];
  // const isProtectedRoute = protectedRoutes.some((route) =>
  //   pathname.startsWith(route)
  // );

  // // If user is not authenticated and trying to access protected route
  // if (!token && isProtectedRoute) {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  // // If user is authenticated and trying to access auth pages (login/auth/signup)
  // if (token && (pathname === "/auth/login" || pathname === "/auth/signup")) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // // If user is authenticated and on home page, redirect to dashboard
  // if (token && pathname === "/") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // // If user is not authenticated and on home page, redirect to login
  // if (!token && pathname === "/") {
  //   return NextResponse.redirect(new URL("/auth/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
