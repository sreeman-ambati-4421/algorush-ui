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
      <button onClick={() => setOpen(true)} className="text-xs font-medium text-brand hover:text-brand-hover">
        + Add funds
      </button>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-panel">
        <h3 className="mb-1 text-base font-semibold text-slate-50">Add funds manually</h3>
        <p className="mb-4 text-xs leading-relaxed text-slate-500">
          For capital you&apos;ve already deposited with the broker (e.g. topping up after an
          insufficient-funds order failure) — this only updates bookkeeping here, it does not move
          any real money.
        </p>

        <label className="field-label">Amount (₹)</label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className="input mb-4"
        />

        {result && <p className="mb-3 text-sm text-slate-300">{result}</p>}

        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setOpen(false)}>
            Close
          </button>
          <button className="btn-primary" disabled={submitting || amount <= 0} onClick={submit}>
            {submitting ? "Adding..." : "Add funds"}
          </button>
        </div>
      </div>
    </div>
  );
}
