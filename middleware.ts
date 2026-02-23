import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Check for crypto identity in session storage
  const identity = request.cookies.get("crypto_identity")

  // Allow auth pages without authentication
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!identity) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
