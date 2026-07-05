import type { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccounts } from "@/lib/db";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const accounts = await getAccounts();

  const demoMode = !process.env.DATABASE_URL;

  return (
    <div>
      {demoMode && (
        <div style={{ background: "#7c3aed", color: "white", textAlign: "center", padding: "6px", fontSize: 13 }}>
          DEMO MODE — sample data, no real database/broker connected
        </div>
      )}
      <header className="dashboard-header">
        <div className="dashboard-header-accounts">
          <strong>AlgoRush</strong>
          {accounts.map((a) => (
            <Link key={a.userid} href={`/${a.userid}/momentum`} style={{ color: "#9ca3af" }}>
              {a.client_name}
            </Link>
          ))}
        </div>
        <div className="dashboard-header-user">
          <span style={{ color: "#9ca3af", fontSize: 13 }}>{session?.user?.email}</span>
          <SignOutButton />
        </div>
      </header>
      <div className="dashboard-content">{children}</div>
    </div>
  );
}
