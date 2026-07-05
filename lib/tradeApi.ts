import type { Strategy } from "./db";

// Server-side only helper for the internal FastAPI trade service that runs on
// the bot host (Algo/api/trade_service.py). Never call this from client
// components -- TRADE_API_SECRET must stay server-side.
if (!process.env.TRADE_API_URL) {
  throw new Error("TRADE_API_URL is not set -- point it at the trade_service host.");
}
const TRADE_API_URL = process.env.TRADE_API_URL;
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
  const url = new URL(`${TRADE_API_URL}/scorecard/${accountId}/${strategy}`);
  if (initialCapital) url.searchParams.set("initial_capital", String(initialCapital));
  const res = await fetch(url, { headers: authHeaders(), cache: "no-store" });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Scorecard API error ${res.status}: ${body}`);
  }
  return res.json();
}

export interface JobSchedule {
  run_time: string; // "HH:MM"
  enabled: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface JobRun {
  id: number;
  started_at: string;
  completed_at: string | null;
  status: "RUNNING" | "SUCCESS" | "FAILED" | "SKIPPED";
  message: string | null;
}

export async function getSchedule(accountId: string, strategy: Strategy): Promise<JobSchedule> {
  const res = await fetch(`${TRADE_API_URL}/schedule/${accountId}/${strategy}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Schedule API error ${res.status}: ${body}`);
  }
  return res.json();
}

export async function updateSchedule(
  req: { account_id: string; strategy: Strategy } & JobSchedule
): Promise<JobSchedule> {
  const res = await fetch(`${TRADE_API_URL}/schedule`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(req),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Schedule API error ${res.status}: ${body}`);
  }
  return res.json();
}

export async function getRecentRuns(accountId: string, strategy: Strategy, limit = 5): Promise<JobRun[]> {
  const res = await fetch(`${TRADE_API_URL}/runs/${accountId}/${strategy}?limit=${limit}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Runs API error ${res.status}: ${body}`);
  }
  return res.json();
}
