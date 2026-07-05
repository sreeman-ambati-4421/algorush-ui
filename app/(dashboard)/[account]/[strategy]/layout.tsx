import type { ReactNode } from "react";
import Link from "next/link";

export default function StrategyLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { account: string; strategy: string };
}) {
  const base = `/${params.account}/${params.strategy}`;
  const strategyLabel = params.strategy === "momentum" ? "Momentum" : "Momentum ETF";

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <Link href={`/${params.account}/momentum`} style={{ fontWeight: params.strategy === "momentum" ? 700 : 400 }}>
          Momentum
        </Link>
        <span style={{ color: "#444" }}>|</span>
        <Link
          href={`/${params.account}/momentum_etf`}
          style={{ fontWeight: params.strategy === "momentum_etf" ? 700 : 400 }}
        >
          Momentum ETF
        </Link>
      </div>
      <h2 style={{ marginTop: 0 }}>{strategyLabel}</h2>
      <nav className="nav-tabs">
        <Link href={base}>Portfolio</Link>
        <Link href={`${base}/history`}>History</Link>
        <Link href={`${base}/scorecard`}>Scorecard</Link>
        <Link href={`${base}/exits`}>Exits</Link>
        <Link href={`${base}/schedule`}>Schedule</Link>
      </nav>
      {children}
    </div>
  );
}
