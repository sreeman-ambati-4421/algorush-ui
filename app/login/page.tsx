"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1>AlgoRush</h1>
        <p style={{ color: "#666", marginBottom: 24 }}>Sign in with an allow-listed Google account</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{ padding: "10px 20px", fontSize: 16, cursor: "pointer" }}
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
