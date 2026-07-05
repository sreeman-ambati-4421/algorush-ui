"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddFundsModal({ accountId, strategy }: { accountId: string; strategy: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/add-funds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: accountId, strategy, amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Add funds failed");
      setResult(`Cash remaining is now ₹${data.cash_remaining.toLocaleString()}`);
      router.refresh();
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}>Add Funds</button>
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
        <h3 style={{ marginTop: 0 }}>Add funds manually</h3>
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: -8 }}>
          For capital you've already deposited with the broker (e.g. topping up after an
          insufficient-funds order failure) -- this only updates bookkeeping here, it does not move
          any real money.
        </p>
        <label>Amount (₹)</label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          style={{ width: "100%", marginBottom: 12, padding: 6 }}
        />
        {result && <p style={{ fontSize: 13 }}>{result}</p>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={() => setOpen(false)}>Close</button>
          <button className="primary" disabled={submitting || amount <= 0} onClick={submit}>
            {submitting ? "Adding..." : "Add funds"}
          </button>
        </div>
      </div>
    </div>
  );
}
