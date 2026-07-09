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
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="stat-tile">
          <span className="stat-label">Holdings</span>
          <span className="stat-value">{holdings.length}</span>
        </div>
        <div className="stat-tile">
          <span className="stat-label">Cash Remaining</span>
          <span className="stat-value">₹{(meta?.cash_remaining ?? 0).toLocaleString()}</span>
          <div className="mt-1">
            <AddFundsModal accountId={params.account} strategy={params.strategy} />
          </div>
        </div>
        <div className="stat-tile">
          <span className="stat-label">Rebalance In</span>
          <span className="stat-value">{meta?.rebalance_counter ?? "-"} day(s)</span>
        </div>
        <div className="stat-tile items-center justify-center">
          <TradeModal accountId={params.account} strategy={params.strategy} defaultSide="BUY" />
        </div>
      </div>

      <div className="card hidden overflow-x-auto md:block">
        <table className="data-table">
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
                <td colSpan={9} className="!text-center text-slate-500">
                  No open positions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {holdings.map((h) => (
          <div key={h.ticker} className="card p-4">
            <div className="mb-3 flex items-baseline justify-between border-b border-ink-border pb-3">
              <span className="font-semibold text-slate-50">{h.ticker.replace("NSE:", "")}</span>
              <span className={`font-bold ${h.percentage >= 0 ? "positive" : "negative"}`}>
                {h.percentage.toFixed(2)}%
              </span>
            </div>
            <div className="space-y-1.5 text-sm">
              <Row label="Shares" value={h.no_of_shares} />
              <Row label="Buy Price" value={h.buy_price} />
              <Row label="Current Price" value={h.current_price} />
              <Row label="Current Value" value={h.current_amount.toLocaleString()} />
              <Row
                label="P&L"
                value={h.profit_loss.toLocaleString()}
                className={h.profit_loss >= 0 ? "positive" : "negative"}
              />
              <Row label="Days" value={h.holding_days} />
            </div>
            <div className="mt-3 text-right">
              <TradeModal
                accountId={params.account}
                strategy={params.strategy}
                defaultTicker={h.ticker}
                defaultSide="SELL"
              />
            </div>
          </div>
        ))}
        {holdings.length === 0 && (
          <div className="card p-6 text-center text-slate-500">No open positions</div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, className }: { label: string; value: string | number; className?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={className}>{value}</span>
    </div>
  );
}
