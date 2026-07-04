import { getScorecard } from "@/lib/tradeApi";
import type { Strategy } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ScorecardPage({ params }: { params: { account: string; strategy: Strategy } }) {
  const sc = await getScorecard(params.account, params.strategy);

  if (sc.error) {
    return <p style={{ color: "#666" }}>{sc.error}</p>;
  }

  return (
    <div>
      <div className="tile-grid">
        <Tile label="XIRR" value={`${sc.returns.xirr_pct ?? "N/A"}%`} />
        <Tile label="Annualised Return" value={`${sc.returns.annualised_pct}%`} />
        <Tile label="ROIC" value={`${sc.returns.roic_pct}%`} />
        <Tile label="Sharpe Ratio" value={sc.risk.sharpe_ratio ?? "N/A"} />
        <Tile label="Calmar Ratio" value={sc.risk.calmar_ratio ?? "N/A"} />
        <Tile label="Max Drawdown" value={`${sc.risk.max_drawdown_pct}%`} />
        <Tile label="Current Drawdown" value={`${sc.risk.current_drawdown_pct}%`} />
        <Tile label="Consistency" value={`${sc.consistency.months_green}/${sc.consistency.total_months} green months`} />
      </div>

      {sc.trade_quality && (
        <>
          <h3>Trade Quality ({sc.trade_quality.total_exits} exits)</h3>
          <div className="tile-grid">
            <Tile label="Win Rate" value={`${sc.trade_quality.win_rate_pct}% (${sc.trade_quality.wins}W / ${sc.trade_quality.losses}L)`} />
            <Tile label="Avg Win" value={`+${sc.trade_quality.avg_win_pct}%`} />
            <Tile label="Avg Loss" value={`${sc.trade_quality.avg_loss_pct}%`} />
            <Tile label="Net PnL (closed)" value={`₹${sc.trade_quality.net_pnl_closed.toLocaleString()}`} />
          </div>
        </>
      )}

      <h3>Open Positions</h3>
      <div className="tile-grid">
        <Tile label="Count" value={sc.open_positions.count} />
        <Tile label="Invested" value={`₹${sc.open_positions.invested.toLocaleString()}`} />
        <Tile label="Unrealized PnL" value={`₹${sc.open_positions.unrealized_pnl.toLocaleString()}`} />
        <Tile label="Cash Remaining" value={`₹${sc.open_positions.cash_remaining.toLocaleString()}`} />
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="tile">
      <div style={{ color: "#9ca3af", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 22 }}>{value}</div>
    </div>
  );
}
