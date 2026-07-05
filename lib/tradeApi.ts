import type { Strategy } from "./db";
import { demoScorecard } from "./demoData";

// Server-side only helper for the internal FastAPI trade service that runs on
// the bot host (Algo/api/trade_service.py). Never call this from client
// components -- TRADE_API_SECRET must stay server-side.

// DEMO_MODE: no trade service configured yet -- see lib/db.ts for the same
// pattern. Trades are faked (never actually placed); scorecard returns
// sample numbers.
const DEMO_MODE = !process.env.TRADE_API_URL;
const TRADE_API_URL = process.env.TRADE_API_URL!;
const TRADE_API_SECRET = process.env.TRADE_API_SECRET!;

function authHeaders() {
  return {
    Authorization: `Bearer ${TRADE_API_SECRET}`,
    "Content-Type": "application/json",
  };
}

export interface TradeRequest {
  account_id: string;
  strategy: Strategy;
  ticker: string;
  side: "BUY" | "SELL";
  quantity: number;
  order_type?: "MKT" | "LMT";
  limit_price?: number;
  requested_by: string;
  dry_run?: boolean;
}

export interface TradeResult {
  trade_id: number;
  status: "PENDING" | "COMPLETE" | "REJECTED";
  average_price: number;
  filled_quantity: number;
  status_message: string;
}

export async function placeTrade(req: TradeRequest): Promise<TradeResult> {
  if (DEMO_MODE) {
    return {
      trade_id: 0,
      status: "COMPLETE",
      average_price: req.limit_price ?? 100,
      filled_quantity: req.quantity,
      status_message: "DEMO MODE -- no real order was placed",
    };
  }
  const res = await fetch(`${TRADE_API_URL}/trade`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(req),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Trade API error ${res.status}: ${body}`);
  }
  return res.json();
}

export interface AddFundsRequest {
  account_id: string;
  strategy: Strategy;
  amount: number;
  requested_by: string;
}

export interface AddFundsResult {
  cash_remaining: number;
  additional_capital_added_today: boolean;
}

export async function addFunds(req: AddFundsRequest): Promise<AddFundsResult> {
  if (DEMO_MODE) {
    return { cash_remaining: req.amount, additional_capital_added_today: true };
  }
  const res = await fetch(`${TRADE_API_URL}/add-funds`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(req),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Add funds API error ${res.status}: ${body}`);
  }
  return res.json();
}

export async function getScorecard(accountId: string, strategy: Strategy, initialCapital?: number) {
  if (DEMO_MODE) return demoScorecard;
  const url = new URL(`${TRADE_API_URL}/scorecard/${accountId}/${strategy}`);
  if (initialCapital) url.searchParams.set("initial_capital", String(initialCapital));
  const res = await fetch(url, { headers: authHeaders(), cache: "no-store" });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Scorecard API error ${res.status}: ${body}`);
  }
  return res.json();
}
