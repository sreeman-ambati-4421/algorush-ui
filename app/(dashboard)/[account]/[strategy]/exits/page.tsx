import { getExitedStocks, Strategy } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ExitsPage({ params }: { params: { account: string; strategy: Strategy } }) {
  const exits = await getExitedStocks(params.account, params.strategy);

  return (
    <>
      <div className="card hidden overflow-x-auto md:block">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Days</th>
              <th>Buy</th>
              <th>Sell</th>
              <th>P&amp;L</th>
              <th>%</th>
              <th>Exit Type</th>
            </tr>
          </thead>
          <tbody>
            {exits.map((e, i) => (
              <tr key={`${e.ticker}-${e.exit_date}-${i}`}>
                <td>{e.ticker.replace("NSE:", "")}</td>
                <td>{e.entry_date}</td>
                <td>{e.exit_date}</td>
                <td>{e.holding_days}</td>
                <td>{e.buy_amount.toLocaleString()}</td>
                <td>{e.sell_amount.toLocaleString()}</td>
                <td className={e.profit_loss >= 0 ? "positive" : "negative"}>{e.profit_loss.toLocaleString()}</td>
                <td className={e.percentage >= 0 ? "positive" : "negative"}>{e.percentage.toFixed(2)}%</td>
                <td>
                  <span className="badge-neutral">{e.exit_type}</span>
                </td>
              </tr>
            ))}
            {exits.length === 0 && (
              <tr>
                <td colSpan={9} className="!text-center text-slate-500">
                  No exits recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {exits.map((e, i) => (
          <div key={`${e.ticker}-${e.exit_date}-${i}-card`} className="card p-4">
            <div className="mb-3 flex items-baseline justify-between border-b border-ink-border pb-3">
              <span className="font-semibold text-slate-50">{e.ticker.replace("NSE:", "")}</span>
              <span className={`font-bold ${e.percentage >= 0 ? "positive" : "negative"}`}>
                {e.percentage.toFixed(2)}%
              </span>
            </div>
            <div className="space-y-1.5 text-sm">
              <Row label="Entry" value={e.entry_date} />
              <Row label="Exit" value={e.exit_date} />
              <Row label="Days" value={e.holding_days} />
              <Row label="Buy" value={e.buy_amount.toLocaleString()} />
              <Row label="Sell" value={e.sell_amount.toLocaleString()} />
              <Row
                label="P&L"
                value={e.profit_loss.toLocaleString()}
                className={e.profit_loss >= 0 ? "positive" : "negative"}
              />
              <Row label="Exit Type" value={e.exit_type} />
            </div>
          </div>
        ))}
        {exits.length === 0 && (
          <div className="card p-6 text-center text-slate-500">No exits recorded yet</div>
        )}
      </div>
    </>
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
