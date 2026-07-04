import { getSummaryHistory, Strategy } from "@/lib/db";
import EquityCurveChart from "@/components/EquityCurveChart";

export const dynamic = "force-dynamic";

export default async function HistoryPage({ params }: { params: { account: string; strategy: Strategy } }) {
  const rows = await getSummaryHistory(params.account, params.strategy);

  if (rows.length === 0) {
    return <p style={{ color: "#666" }}>No summary history yet.</p>;
  }

  const latest = rows[rows.length - 1];

  return (
    <div>
      <div className="tile-grid">
        <div className="tile">
          <div style={{ color: "#9ca3af", fontSize: 13 }}>Total Value</div>
          <div style={{ fontSize: 24 }}>{"₹"}{latest.total_value_holdings.toLocaleString()}</div>
        </div>
        <div className="tile">
          <div style={{ color: "#9ca3af", fontSize: 13 }}>Invested Capital</div>
          <div style={{ fontSize: 24 }}>{"₹"}{latest.invested_capital.toLocaleString()}</div>
        </div>
        <div className="tile">
          <div style={{ color: "#9ca3af", fontSize: 13 }}>Total P&amp;L</div>
          <div className={latest.total_profit_loss >= 0 ? "positive" : "negative"} style={{ fontSize: 24 }}>
            {"₹"}{latest.total_profit_loss.toLocaleString()}
          </div>
        </div>
      </div>
      <EquityCurveChart data={rows} />
    </div>
  );
}
