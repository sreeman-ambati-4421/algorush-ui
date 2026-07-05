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
    <div className="tile">
      <h3 style={{ marginTop: 0 }}>Bot schedule</h3>
      <p style={{ fontSize: 13, color: "#9ca3af", marginTop: -8 }}>
        The bot host checks this frequently and only launches once, when the current time crosses
        run time on an enabled day.
      </p>

      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          Run time (IST)
          <input
            type="time"
            value={schedule.run_time}
            onChange={(e) => setSchedule((s) => ({ ...s, run_time: e.target.value }))}
            style={{ padding: 6 }}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 18 }}>
          <input
            type="checkbox"
            checked={schedule.enabled}
            onChange={() => setSchedule((s) => ({ ...s, enabled: !s.enabled }))}
          />
          Enabled
        </label>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        {DAY_LABELS.map(({ key, label }) => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <input type="checkbox" checked={schedule[key]} onChange={() => toggleDay(key)} />
            {label}
          </label>
        ))}
      </div>

      {result && <p style={{ fontSize: 13 }}>{result}</p>}
      <button className="primary" disabled={submitting} onClick={submit}>
        {submitting ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
