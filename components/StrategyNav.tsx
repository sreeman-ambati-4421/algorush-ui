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
      <nav className="nav-tabs nav-tabs-desktop">
        {TABS.map((t) => (
          <Link key={t.path} href={`${base}${t.path}`} className={pathname === `${base}${t.path}` ? "active" : ""}>
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="nav-mobile">
        <button className="nav-mobile-toggle" onClick={() => setOpen((o) => !o)}>
          <span>☰</span>
          <span>{current.label}</span>
        </button>
        {open && (
          <div className="nav-mobile-menu">
            {TABS.map((t) => (
              <Link
                key={t.path}
                href={`${base}${t.path}`}
                className={pathname === `${base}${t.path}` ? "active" : ""}
                onClick={() => setOpen(false)}
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
