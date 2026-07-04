"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/login" })} style={{ fontSize: 13, cursor: "pointer" }}>
      Sign out
    </button>
  );
}
