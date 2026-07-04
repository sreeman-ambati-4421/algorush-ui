import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Real trades can be placed from this dashboard, so sign-in is locked to an
// explicit allow-list of emails (ALLOWED_EMAILS, comma-separated) on top of
// Google OAuth -- not just "anyone with a Google account".
const allowedEmails = (process.env.ALLOWED_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      return allowedEmails.includes(user.email.toLowerCase());
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
