"use client";

import Link from "next/link";
import { useState } from "react";
import type { Account } from "@/lib/db";

export default function AccountNav({ accounts }: { accounts: Account[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="dashboard-header-accounts dashboard-header-accounts-desktop">
        <strong>AlgoRush</strong>
        {accounts.map((a) => (
          <Link key={a.userid} href={`/${a.userid}/momentum`} style={{ color: "#9ca3af" }}>
            {a.client_name}
          </Link>
        ))}
      </div>

      <div className="header-mobile">
        <strong>AlgoRush</strong>
        <button className="nav-mobile-toggle" onClick={() => setOpen((o) => !o)} aria-label="Accounts menu">
          ☰
        </button>
        {open && (
          <div className="nav-mobile-menu">
            {accounts.map((a) => (
              <Link key={a.userid} href={`/${a.userid}/momentum`} onClick={() => setOpen(false)}>
                {a.client_name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
