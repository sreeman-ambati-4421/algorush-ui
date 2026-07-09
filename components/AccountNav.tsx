"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Account } from "@/lib/db";

export default function AccountNav({ accounts }: { accounts: Account[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Link href="/" className="mr-1 flex items-center">
        <Image src="/logo-mark.png" alt="AlgoRush" width={806} height={172} priority className="h-6 w-auto sm:h-7" />
      </Link>

      <div className="hidden items-center gap-1 sm:flex">
        {accounts.map((a) => (
          <Link
            key={a.userid}
            href={`/${a.userid}/momentum`}
            className="rounded-lg px-3 py-1.5 text-sm text-slate-400 transition-colors hover:bg-ink-raised hover:text-slate-100"
          >
            {a.client_name}
          </Link>
        ))}
      </div>

      <div className="relative sm:hidden">
        <button
          className="btn-ghost btn-sm gap-2"
          onClick={() => setOpen((o) => !o)}
          aria-label="Accounts menu"
        >
          <span>☰</span>
          <span>Accounts</span>
        </button>
        {open && (
          <div className="animate-scale-in card absolute left-0 top-[calc(100%+6px)] z-40 min-w-[180px] overflow-hidden p-1">
            {accounts.map((a) => (
              <Link
                key={a.userid}
                href={`/${a.userid}/momentum`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-ink-raised hover:text-slate-100"
              >
                {a.client_name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
