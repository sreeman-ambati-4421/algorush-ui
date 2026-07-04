import type { Account, Holding, PortfolioMeta, SummaryRow, ExitedStockRow } from "./db";

// Sample data used ONLY when DATABASE_URL is not set (local UI preview before
// a real Neon project + migration exist). Shapes match the real schema.

export const demoAccounts: Account[] = [
  { userid: "ZU9940", client_name: "PRAMOD_Z", trade_on: true, is_base: true },
  { userid: "AB1234", client_name: "SREEMAN_A", trade_on: true, is_base: false },
];

export const demoMeta: PortfolioMeta = {
  executed_date: "04-07-2026",
  cash_remaining: 84250.5,
  rebalance_counter: 3,
};

export const demoHoldings: Holding[] = [
  { ticker: "NSE:TCS", entry_date: "12-05-2026", holding_days: 53, no_of_shares: 25, buy_price: 3820.5, buy_amount: 95512.5, current_price: 4012.2, current_amount: 100305, ema_100: 3890.1, profit_loss: 4792.5, percentage: 5.02 },
  { ticker: "NSE:INFY", entry_date: "20-04-2026", holding_days: 75, no_of_shares: 60, buy_price: 1540, buy_amount: 92400, current_price: 1489.4, current_amount: 89364, ema_100: 1510.2, profit_loss: -3036, percentage: -3.29 },
  { ticker: "NSE:BAJFINANCE", entry_date: "02-06-2026", holding_days: 32, no_of_shares: 12, buy_price: 6980, buy_amount: 83760, current_price: 7415.8, current_amount: 88989.6, ema_100: 7120.4, profit_loss: 5229.6, percentage: 6.24 },
  { ticker: "NSE:LIQUIDCASE", entry_date: "01-07-2026", holding_days: 3, no_of_shares: 210, buy_price: 1000.1, buy_amount: 210021, current_price: 1000.4, current_amount: 210084, ema_100: 0, profit_loss: 63, percentage: 0.03 },
];

export const demoSummaryHistory: SummaryRow[] = Array.from({ length: 60 }).map((_, i) => {
  const base = 2500000;
  const drift = i * 4200 + Math.sin(i / 4) * 30000;
  return {
    date: `${String((i % 28) + 1).padStart(2, "0")}-0${(Math.floor(i / 28) % 9) + 1}-2026`,
    no_of_holdings: 12 + (i % 4),
    invested_capital: base,
    holdings_value: base + drift - 210084,
    cash_remaining: 84250.5 + (i % 5) * 1000,
    total_value_holdings: base + drift,
    holding_values_diff: i === 0 ? null : 4200 + Math.cos(i / 3) * 8000,
    total_profit_loss: drift,
  };
});

export const demoExitedStocks: ExitedStockRow[] = [
  { ticker: "NSE:HDFCBANK", entry_date: "10-01-2026", exit_date: "15-04-2026", holding_days: 95, no_of_shares: 40, buy_price: 1620, buy_amount: 64800, sell_price: 1518, sell_amount: 60720, profit_loss: -4080, percentage: -6.3, exit_type: "EMA BREACH" },
  { ticker: "NSE:TITAN", entry_date: "05-02-2026", exit_date: "01-05-2026", holding_days: 85, no_of_shares: 18, buy_price: 3210, buy_amount: 57780, sell_price: 3640, sell_amount: 65520, profit_loss: 7740, percentage: 13.4, exit_type: "MOMENTUM_REBALANCE" },
];

export const demoScorecard = {
  returns: { initial_capital: 2500000, total_invested: 2500000, total_sip: 0, total_lump_sum: 0, current_value: 2647000, net_pnl: 147000, roic_pct: 5.88, annualised_pct: 21.4, xirr_pct: 23.1 },
  risk: { sharpe_ratio: 1.42, calmar_ratio: 2.1, peak_value: 2660000, peak_date: "2026-06-30", max_drawdown_pct: -8.4, max_drawdown_date: "2026-05-12", max_drawdown_duration_days: 18, current_drawdown_pct: -0.5, current_drawdown_duration_days: 2 },
  consistency: { months_green: 5, total_months: 6 },
  trade_quality: { total_exits: 2, win_rate_pct: 50, wins: 1, losses: 1, avg_win_pct: 13.4, avg_loss_pct: -6.3, net_pnl_closed: 3660, by_exit_type: [] },
  open_positions: { count: 4, cash_remaining: 84250.5, invested: 481693.5, unrealized_pnl: 7049.1 },
};
