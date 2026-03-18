import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "better-auth.session_token";

async function validateSession(request: NextRequest): Promise<boolean> {
  try {
    const sessionUrl = new URL("/api/auth/get-session", request.url);
    const response = await fetch(sessionUrl, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data?.session != null;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE);
  const { pathname } = request.nextUrl;

  // No cookie → no need to validate
  if (!sessionCookie) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }

  // Cookie present → validate against the DB
  const isValid = await validateSession(request);

  if (!isValid) {
    // Delete stale cookie
    const response = pathname.startsWith("/dashboard")
      ? NextResponse.redirect(new URL("/signin", request.url))
      : NextResponse.next();
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  // Valid session — redirect away from signin
  if (pathname === "/signin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin"],
};
