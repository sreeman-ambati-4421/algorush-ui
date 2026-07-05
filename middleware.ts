import { withAuth } from "next-auth/middleware";

export default withAuth({});

export const config = {
  // Everything except NextAuth's own routes, the login page, and static assets
  // requires a signed-in, allow-listed session.
  matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)"],
};
