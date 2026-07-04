"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TradeModal({
  accountId,
  strategy,
  defaultTicker,
  defaultSide,
}: {
  accountId: string;
  strategy: string;
  defaultTicker?: string;
  defaultSide?: "BUY" | "SELL";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ticker, setTicker] = useState(defaultTicker ?? "");
  const [side, setSide] = useState<"BUY" | "SELL">(defaultSide ?? "BUY");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: accountId, strategy, ticker, side, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Trade failed");
      setResult(`${data.status}: ${data.filled_quantity} @ ${data.average_price}`);
      router.refresh();
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button className={`primary ${defaultSide === "SELL" ? "sell" : ""}`} onClick={() => setOpen(true)}>
        {defaultSide ?? "Trade"}
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div className="tile" style={{ width: 320 }}>
        <h3 style={{ marginTop: 0 }}>Place manual order</h3>
        <label>Ticker (e.g. NSE:TCS)</label>
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 6 }}
        />
        <label>Side</label>
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as "BUY" | "SELL")}
          style={{ width: "100%", marginBottom: 8, padding: 6 }}
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        <label>Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
          style={{ width: "100%", marginBottom: 12, padding: 6 }}
        />
        {result && <p style={{ fontSize: 13 }}>{result}</p>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => setOpen(false)}>Close</button>
          <button className="primary" disabled={submitting || !ticker} onClick={submit}>
            {submitting ? "Placing..." : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
}
