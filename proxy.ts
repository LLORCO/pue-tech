import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Redirección optimista: solo mira si existe la cookie de sesión, sin tocar la
// base. La verificación real es requireAdmin() en cada página y Server Action.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/panel/login") return NextResponse.next();
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/panel/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*"],
};
