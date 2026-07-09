"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { JobSchedule } from "@/lib/tradeApi";

const DAY_LABELS: { key: keyof Omit<JobSchedule, "run_time" | "enabled">; label: string }[] = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

export default function ScheduleForm({
  accountId,
  strategy,
  initial,
}: {
  accountId: string;
  strategy: string;
  initial: JobSchedule;
}) {
  const router = useRouter();
  const [schedule, setSchedule] = useState<JobSchedule>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function toggleDay(key: keyof JobSchedule) {
    setSchedule((s) => ({ ...s, [key]: !s[key] }));
  }

  async function submit() {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: accountId, strategy, ...schedule }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setResult("Saved");
      router.refresh();
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card p-5 sm:p-6">
      <h3 className="text-base font-semibold text-slate-50">Bot schedule</h3>
      <p className="mb-5 mt-1 max-w-2xl text-sm text-slate-500">
        The bot host checks this frequently and only launches once, when the current time crosses
        run time on an enabled day.
      </p>

      <div className="mb-5 flex flex-wrap items-end gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="field-label mb-0">Run time (IST)</span>
          <input
            type="time"
            value={schedule.run_time}
            onChange={(e) => setSchedule((s) => ({ ...s, run_time: e.target.value }))}
            className="input w-auto"
          />
        </label>
        <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={schedule.enabled}
            onChange={() => setSchedule((s) => ({ ...s, enabled: !s.enabled }))}
            className="h-4 w-4 rounded border-ink-border bg-ink-bg text-brand accent-brand"
          />
          Enabled
        </label>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {DAY_LABELS.map(({ key, label }) => {
          const active = Boolean(schedule[key]);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleDay(key)}
              className={
                active
                  ? "rounded-lg border border-brand/40 bg-brand-soft px-3 py-1.5 text-xs font-medium text-brand transition-colors"
                  : "rounded-lg border border-ink-border bg-ink-raised/40 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-300"
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {result && <p className="mb-3 text-sm text-slate-300">{result}</p>}
      <button className="btn-primary" disabled={submitting} onClick={submit}>
        {submitting ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
