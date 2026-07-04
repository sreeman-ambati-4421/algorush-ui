import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// DEMO_MODE: no Google OAuth configured yet (e.g. local UI preview before
// real credentials exist) -- skip auth entirely rather than sending everyone
// into an unusable sign-in loop. Once GOOGLE_CLIENT_ID is set, this reverts
// to the real NextAuth-protected behavior.
const DEMO_MODE = !process.env.GOOGLE_CLIENT_ID;

export default DEMO_MODE ? () => NextResponse.next() : withAuth({});

export const config = {
  // Everything except NextAuth's own routes, the login page, and static assets
  // requires a signed-in, allow-listed session.
  matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)"],
};
