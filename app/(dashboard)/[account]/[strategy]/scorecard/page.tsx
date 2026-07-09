import { getScorecard } from "@/lib/tradeApi";
import type { Strategy } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ScorecardPage({ params }: { params: { account: string; strategy: Strategy } }) {
  const sc = await getScorecard(params.account, params.strategy);

  if (sc.error) {
    return <p className="text-slate-500">{sc.error}</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile label="XIRR" value={`${sc.returns.xirr_pct ?? "N/A"}%`} />
        <Tile label="Annualised Return" value={`${sc.returns.annualised_pct}%`} />
        <Tile label="ROIC" value={`${sc.returns.roic_pct}%`} />
        <Tile label="Sharpe Ratio" value={sc.risk.sharpe_ratio ?? "N/A"} />
        <Tile label="Calmar Ratio" value={sc.risk.calmar_ratio ?? "N/A"} />
        <Tile label="Max Drawdown" value={`${sc.risk.max_drawdown_pct}%`} tone="negative" />
        <Tile label="Current Drawdown" value={`${sc.risk.current_drawdown_pct}%`} tone="negative" />
        <Tile label="Consistency" value={`${sc.consistency.months_green}/${sc.consistency.total_months} green months`} />
      </div>

      {sc.trade_quality && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Trade Quality <span className="text-slate-600">({sc.trade_quality.total_exits} exits)</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Tile label="Win Rate" value={`${sc.trade_quality.win_rate_pct}% (${sc.trade_quality.wins}W / ${sc.trade_quality.losses}L)`} />
            <Tile label="Avg Win" value={`+${sc.trade_quality.avg_win_pct}%`} tone="positive" />
            <Tile label="Avg Loss" value={`${sc.trade_quality.avg_loss_pct}%`} tone="negative" />
            <Tile label="Net PnL (closed)" value={`₹${sc.trade_quality.net_pnl_closed.toLocaleString()}`} />
          </div>
        </section>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Open Positions</h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Tile label="Count" value={sc.open_positions.count} />
          <Tile label="Invested" value={`₹${sc.open_positions.invested.toLocaleString()}`} />
          <Tile label="Unrealized PnL" value={`₹${sc.open_positions.unrealized_pnl.toLocaleString()}`} />
          <Tile label="Cash Remaining" value={`₹${sc.open_positions.cash_remaining.toLocaleString()}`} />
        </div>
      </section>
    </div>
  );
}

function Tile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: "positive" | "negative";
}) {
  return (
    <div className="stat-tile">
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${tone ? tone : ""}`}>{value}</span>
    </div>
  );
}
