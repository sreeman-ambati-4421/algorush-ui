import { getSummaryHistory, Strategy } from "@/lib/db";
import EquityCurveChart from "@/components/EquityCurveChart";

export const dynamic = "force-dynamic";

export default async function HistoryPage({ params }: { params: { account: string; strategy: Strategy } }) {
  const rows = await getSummaryHistory(params.account, params.strategy);

  if (rows.length === 0) {
    return <p className="text-slate-500">No summary history yet.</p>;
  }

  const latest = rows[rows.length - 1];

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="stat-tile">
          <span className="stat-label">Total Value</span>
          <span className="stat-value">₹{latest.total_value_holdings.toLocaleString()}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-label">Invested Capital</span>
          <span className="stat-value">₹{latest.invested_capital.toLocaleString()}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-label">Total P&amp;L</span>
          <span className={`stat-value ${latest.total_profit_loss >= 0 ? "positive" : "negative"}`}>
            ₹{latest.total_profit_loss.toLocaleString()}
          </span>
        </div>
      </div>
      <EquityCurveChart data={rows} />
    </div>
  );
}
