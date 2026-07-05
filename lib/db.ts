import postgres from "postgres";

// Server-side only. Reads/writes Postgres directly for everything except
// placing trades and computing scorecard metrics (see lib/tradeApi.ts) --
// those go through the internal FastAPI service running on the bot host.
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set -- point it at your Postgres instance.");
}
// prepare: false -- required when DATABASE_URL points at a connection pooler
// running in transaction mode (e.g. Supabase's pgbouncer on port 6543), which
// doesn't support prepared statements.
//
// types.numeric -- the postgres package returns NUMERIC/DECIMAL columns as
// strings by default (avoids float-precision loss), but every schema column
// here (percentage, prices, amounts, etc.) is read as a plain JS number
// throughout this codebase (e.g. Holding.percentage.toFixed(2)). Parse them
// as floats at the driver level instead of touching every call site.
const numeric = { to: 1700, from: [1700], serialize: (x: number) => String(x), parse: (x: string) => parseFloat(x) };
// types.date -- the postgres package parses DATE columns into JS Date
// objects by default, but every date field here (entry_date, exit_date,
// executed_date, date) is typed as string and rendered directly as JSX text
// or passed to strftime-style formatting. Keep the raw "YYYY-MM-DD" string.
const date = { to: 1082, from: [1082], serialize: (x: string) => x, parse: (x: string) => x };
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false, types: { numeric, date } });

export type Strategy = "momentum" | "momentum_etf";

export interface Account {
  userid: string;
  client_name: string;
  trade_on: boolean;
  is_base: boolean;
}

export interface Holding {
  ticker: string;
  entry_date: string;
  holding_days: number;
  no_of_shares: number;
  buy_price: number;
  buy_amount: number;
  current_price: number;
  current_amount: number;
  ema_100: number;
  profit_loss: number;
  percentage: number;
}

export interface PortfolioMeta {
  executed_date: string;
  cash_remaining: number;
  rebalance_counter: number;
}

export interface SummaryRow {
  date: string;
  no_of_holdings: number;
  invested_capital: number;
  holdings_value: number;
  cash_remaining: number;
  total_value_holdings: number;
  holding_values_diff: number | null;
  total_profit_loss: number;
}

export interface ExitedStockRow {
  ticker: string;
  entry_date: string;
  exit_date: string;
  holding_days: number;
  no_of_shares: number;
  buy_price: number;
  buy_amount: number;
  sell_price: number;
  sell_amount: number;
  profit_loss: number;
  percentage: number;
  exit_type: string;
}

export async function getAccounts(): Promise<Account[]> {
  return (await sql`
    SELECT userid, client_name, trade_on, is_base FROM accounts ORDER BY client_name
  `) as unknown as Account[];
}

export async function getPortfolioMeta(accountId: string, strategy: Strategy): Promise<PortfolioMeta | null> {
  const rows = (await sql`
    SELECT executed_date, cash_remaining, rebalance_counter
    FROM portfolio_meta WHERE account_id = ${accountId} AND strategy = ${strategy}
  `) as unknown as PortfolioMeta[];
  return rows[0] ?? null;
}

export async function getHoldings(accountId: string, strategy: Strategy): Promise<Holding[]> {
  return (await sql`
    SELECT ticker, entry_date, holding_days, no_of_shares, buy_price, buy_amount,
           current_price, current_amount, ema_100, profit_loss, percentage
    FROM portfolio_holdings
    WHERE account_id = ${accountId} AND strategy = ${strategy}
    ORDER BY current_amount DESC
  `) as unknown as Holding[];
}

export async function getSummaryHistory(accountId: string, strategy: Strategy): Promise<SummaryRow[]> {
  return (await sql`
    SELECT date, no_of_holdings, invested_capital, holdings_value, cash_remaining,
           total_value_holdings, holding_values_diff, total_profit_loss
    FROM summary_history
    WHERE account_id = ${accountId} AND strategy = ${strategy}
    ORDER BY date ASC
  `) as unknown as SummaryRow[];
}

export async function getExitedStocks(accountId: string, strategy: Strategy): Promise<ExitedStockRow[]> {
  return (await sql`
    SELECT ticker, entry_date, exit_date, holding_days, no_of_shares, buy_price, buy_amount,
           sell_price, sell_amount, profit_loss, percentage, exit_type
    FROM exited_stocks
    WHERE account_id = ${accountId} AND strategy = ${strategy}
    ORDER BY exit_date DESC
  `) as unknown as ExitedStockRow[];
}
