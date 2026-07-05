import { getHoldings, getPortfolioMeta, Strategy } from "@/lib/db";
import TradeModal from "@/components/TradeModal";
import AddFundsModal from "@/components/AddFundsModal";

export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  params,
}: {
  params: { account: string; strategy: Strategy };
}) {
  const [meta, holdings] = await Promise.all([
    getPortfolioMeta(params.account, params.strategy),
    getHoldings(params.account, params.strategy),
  ]);

  return (
    <div>
      <div className="tile-grid">
        <div className="tile">
          <div style={{ color: "#9ca3af", fontSize: 13 }}>Holdings</div>
          <div style={{ fontSize: 24 }}>{holdings.length}</div>
        </div>
        <div className="tile">
          <div style={{ color: "#9ca3af", fontSize: 13 }}>Cash Remaining</div>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{"₹"}{(meta?.cash_remaining ?? 0).toLocaleString()}</div>
          <AddFundsModal accountId={params.account} strategy={params.strategy} />
        </div>
        <div className="tile">
          <div style={{ color: "#9ca3af", fontSize: 13 }}>Rebalance In</div>
          <div style={{ fontSize: 24 }}>{meta?.rebalance_counter ?? "-"} day(s)</div>
        </div>
        <div className="tile" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TradeModal accountId={params.account} strategy={params.strategy} defaultSide="BUY" />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Shares</th>
            <th>Buy Price</th>
            <th>Current Price</th>
            <th>Current Value</th>
            <th>P&amp;L</th>
            <th>%</th>
            <th>Days</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr key={h.ticker}>
              <td>{h.ticker.replace("NSE:", "")}</td>
              <td>{h.no_of_shares}</td>
              <td>{h.buy_price}</td>
              <td>{h.current_price}</td>
              <td>{h.current_amount.toLocaleString()}</td>
              <td className={h.profit_loss >= 0 ? "positive" : "negative"}>
                {h.profit_loss.toLocaleString()}
              </td>
              <td className={h.percentage >= 0 ? "positive" : "negative"}>{h.percentage.toFixed(2)}%</td>
              <td>{h.holding_days}</td>
              <td>
                <TradeModal
                  accountId={params.account}
                  strategy={params.strategy}
                  defaultTicker={h.ticker}
                  defaultSide="SELL"
                />
              </td>
            </tr>
          ))}
          {holdings.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", color: "#666" }}>
                No open positions
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
