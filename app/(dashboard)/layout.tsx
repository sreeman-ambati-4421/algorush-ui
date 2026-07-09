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
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-ink-border bg-ink-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <AccountNav accounts={accounts} />
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">{session?.user?.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </div>
  );
}
