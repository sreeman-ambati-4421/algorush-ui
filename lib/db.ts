import postgres from "postgres";
import { demoAccounts, demoMeta, demoHoldings, demoSummaryHistory, demoExitedStocks } from "./demoData";

// Server-side only. Reads/writes Postgres directly for everything except
// placing trades and computing scorecard metrics (see lib/tradeApi.ts) --
// those go through the internal FastAPI service running on the bot host.
//
// DEMO_MODE: when no DATABASE_URL is configured yet (e.g. previewing the UI
// before a database exists), fall back to lib/demoData.ts instead of
// throwing. Remove once a real DATABASE_URL is always set.
const DEMO_MODE = !process.env.DATABASE_URL;
// prepare: false -- required when DATABASE_URL points at a connection pooler
// running in transaction mode (e.g. Supabase's pgbouncer on port 6543), which
// doesn't support prepared statements.
const sql = DEMO_MODE ? null : postgres(process.env.DATABASE_URL!, { ssl: "require", prepare: false });

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
  if (DEMO_MODE) return demoAccounts;
  return (await sql!`
    SELECT userid, client_name, trade_on, is_base FROM accounts ORDER BY client_name
  `) as unknown as Account[];
}

export async function getPortfolioMeta(accountId: string, strategy: Strategy): Promise<PortfolioMeta | null> {
  if (DEMO_MODE) return demoMeta;
  const rows = (await sql!`
    SELECT executed_date, cash_remaining, rebalance_counter
    FROM portfolio_meta WHERE account_id = ${accountId} AND strategy = ${strategy}
  `) as unknown as PortfolioMeta[];
  return rows[0] ?? null;
}

export async function getHoldings(accountId: string, strategy: Strategy): Promise<Holding[]> {
  if (DEMO_MODE) return demoHoldings;
  return (await sql!`
    SELECT ticker, entry_date, holding_days, no_of_shares, buy_price, buy_amount,
           current_price, current_amount, ema_100, profit_loss, percentage
    FROM portfolio_holdings
    WHERE account_id = ${accountId} AND strategy = ${strategy}
    ORDER BY current_amount DESC
  `) as unknown as Holding[];
}

export async function getSummaryHistory(accountId: string, strategy: Strategy): Promise<SummaryRow[]> {
  if (DEMO_MODE) return demoSummaryHistory;
  return (await sql!`
    SELECT date, no_of_holdings, invested_capital, holdings_value, cash_remaining,
           total_value_holdings, holding_values_diff, total_profit_loss
    FROM summary_history
    WHERE account_id = ${accountId} AND strategy = ${strategy}
    ORDER BY date ASC
  `) as unknown as SummaryRow[];
}

export async function getExitedStocks(accountId: string, strategy: Strategy): Promise<ExitedStockRow[]> {
  if (DEMO_MODE) return demoExitedStocks;
  return (await sql!`
    SELECT ticker, entry_date, exit_date, holding_days, no_of_shares, buy_price, buy_amount,
           sell_price, sell_amount, profit_loss, percentage, exit_type
    FROM exited_stocks
    WHERE account_id = ${accountId} AND strategy = ${strategy}
    ORDER BY exit_date DESC
  `) as unknown as ExitedStockRow[];
}
