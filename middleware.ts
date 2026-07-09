import { withAuth } from "next-auth/middleware";

export default withAuth({});

export const config = {
  // Everything except NextAuth's own routes, the login page, and static assets
  // requires a signed-in, allow-listed session. Public files served straight out
  // of /public (e.g. logo*.png) must stay excluded too -- next/image's server-side
  // optimizer fetches them same-origin with no session cookie, so gating them here
  // makes every <Image> of a local asset fail with "not a valid image".
  matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)"],
};
