import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If there is no token (user is not authenticated)
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check if the route starts with /admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // If user is not an admin, redirect to home page
    if (!token.isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next(); // Continue to the requested page if authorized
}

// Apply middleware only to admin routes
export const config = {
  matcher: "/admin/:path*",
};
