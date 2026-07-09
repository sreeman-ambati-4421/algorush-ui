import type { ReactNode } from "react";
import Link from "next/link";
import StrategyNav from "@/components/StrategyNav";

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
      <div className="mb-1 flex items-center gap-2 text-xs">
        <Link
          href={`/${params.account}/momentum`}
          className={params.strategy === "momentum" ? "font-semibold text-slate-100" : "text-slate-500 hover:text-slate-300"}
        >
          Momentum
        </Link>
        <span className="text-slate-700">/</span>
        <Link
          href={`/${params.account}/momentum_etf`}
          className={params.strategy === "momentum_etf" ? "font-semibold text-slate-100" : "text-slate-500 hover:text-slate-300"}
        >
          Momentum ETF
        </Link>
      </div>
      <h2 className="mb-5 text-2xl font-semibold text-slate-50">{strategyLabel}</h2>
      <StrategyNav base={base} />
      {children}
    </div>
  );
}
