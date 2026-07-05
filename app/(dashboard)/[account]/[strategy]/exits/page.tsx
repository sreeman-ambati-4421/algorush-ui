import { getExitedStocks, Strategy } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ExitsPage({ params }: { params: { account: string; strategy: Strategy } }) {
  const exits = await getExitedStocks(params.account, params.strategy);

  return (
    <>
    <div className="table-wrap">
      <table>
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
              <td>{e.exit_type}</td>
            </tr>
          ))}
          {exits.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: "center", color: "#666" }}>
                No exits recorded yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="cards">
      {exits.map((e, i) => (
        <div key={`${e.ticker}-${e.exit_date}-${i}-card`} className="tile">
          <div className="card-header">
            <span className="ticker">{e.ticker.replace("NSE:", "")}</span>
            <span className={e.percentage >= 0 ? "positive" : "negative"} style={{ fontWeight: 700 }}>
              {e.percentage.toFixed(2)}%
            </span>
          </div>
          <div className="card-row">
            <span className="label">Entry</span>
            <span>{e.entry_date}</span>
          </div>
          <div className="card-row">
            <span className="label">Exit</span>
            <span>{e.exit_date}</span>
          </div>
          <div className="card-row">
            <span className="label">Days</span>
            <span>{e.holding_days}</span>
          </div>
          <div className="card-row">
            <span className="label">Buy</span>
            <span>{e.buy_amount.toLocaleString()}</span>
          </div>
          <div className="card-row">
            <span className="label">Sell</span>
            <span>{e.sell_amount.toLocaleString()}</span>
          </div>
          <div className="card-row">
            <span className="label">P&amp;L</span>
            <span className={e.profit_loss >= 0 ? "positive" : "negative"}>{e.profit_loss.toLocaleString()}</span>
          </div>
          <div className="card-row">
            <span className="label">Exit Type</span>
            <span>{e.exit_type}</span>
          </div>
        </div>
      ))}
      {exits.length === 0 && (
        <div className="tile" style={{ textAlign: "center", color: "#666" }}>
          No exits recorded yet
        </div>
      )}
    </div>
    </>
  );
}
