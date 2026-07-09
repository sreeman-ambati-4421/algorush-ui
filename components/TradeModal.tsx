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
      <button
        className={defaultSide === "SELL" ? "btn-danger btn-sm" : "btn-primary"}
        onClick={() => setOpen(true)}
      >
        {defaultSide ?? "Trade"}
      </button>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-panel">
        <h3 className="mb-4 text-base font-semibold text-slate-50">Place manual order</h3>

        <label className="field-label">Ticker (e.g. NSE:TCS)</label>
        <input value={ticker} onChange={(e) => setTicker(e.target.value)} className="input mb-3" />

        <label className="field-label">Side</label>
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as "BUY" | "SELL")}
          className="input mb-3"
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>

        <label className="field-label">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
          className="input mb-4"
        />

        {result && <p className="mb-3 text-sm text-slate-300">{result}</p>}

        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setOpen(false)}>
            Close
          </button>
          <button className="btn-primary" disabled={submitting || !ticker} onClick={submit}>
            {submitting ? "Placing..." : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
}
