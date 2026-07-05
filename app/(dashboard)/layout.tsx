import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccounts } from "@/lib/db";
import SignOutButton from "@/components/SignOutButton";
import AccountNav from "@/components/AccountNav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const accounts = await getAccounts();

  return (
    <div>
      <header className="dashboard-header">
        <AccountNav accounts={accounts} />
        <div className="dashboard-header-user">
          <span style={{ color: "#9ca3af", fontSize: 13 }}>{session?.user?.email}</span>
          <SignOutButton />
        </div>
      </header>
      <div className="dashboard-content">{children}</div>
    </div>
  );
}
