"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const TABS = [
  { path: "", label: "Portfolio" },
  { path: "/history", label: "History" },
  { path: "/scorecard", label: "Scorecard" },
  { path: "/exits", label: "Exits" },
  { path: "/schedule", label: "Schedule" },
];

export default function StrategyNav({ base }: { base: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = TABS.find((t) => pathname === `${base}${t.path}`) ?? TABS[0];

  return (
    <>
      <nav className="mb-6 hidden flex-wrap items-center gap-1 border-b border-ink-border pb-3 sm:flex">
        {TABS.map((t) => (
          <Link
            key={t.path}
            href={`${base}${t.path}`}
            className={pathname === `${base}${t.path}` ? "nav-pill-active" : "nav-pill"}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="relative mb-6 sm:hidden">
        <button className="btn-ghost w-full justify-between" onClick={() => setOpen((o) => !o)}>
          <span className="flex items-center gap-2">
            <span>☰</span>
            <span>{current.label}</span>
          </span>
          <span className="text-slate-500">{open ? "▲" : "▼"}</span>
        </button>
        {open && (
          <div className="card animate-scale-in absolute left-0 right-0 top-[calc(100%+6px)] z-40 overflow-hidden p-1">
            {TABS.map((t) => (
              <Link
                key={t.path}
                href={`${base}${t.path}`}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  pathname === `${base}${t.path}`
                    ? "bg-brand-soft text-brand"
                    : "text-slate-300 hover:bg-ink-raised hover:text-slate-100"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
