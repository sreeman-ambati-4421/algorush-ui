import { getSchedule, getRecentRuns } from "@/lib/tradeApi";
import ScheduleForm from "@/components/ScheduleForm";
import type { Strategy } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusClass(status: string) {
  if (status === "SUCCESS") return "positive";
  if (status === "FAILED") return "negative";
  return undefined;
}

export default async function SchedulePage({
  params,
}: {
  params: { account: string; strategy: Strategy };
}) {
  const [schedule, runs] = await Promise.all([
    getSchedule(params.account, params.strategy),
    getRecentRuns(params.account, params.strategy, 5),
  ]);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <ScheduleForm accountId={params.account} strategy={params.strategy} initial={schedule} />
      </div>

      <h3>Latest runs</h3>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Started</th>
              <th>Completed</th>
              <th>Status</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id}>
                <td>{formatDateTime(r.started_at)}</td>
                <td>{r.completed_at ? formatDateTime(r.completed_at) : "-"}</td>
                <td className={statusClass(r.status)}>{r.status}</td>
                <td style={{ textAlign: "left", whiteSpace: "normal" }}>{r.message ?? "-"}</td>
              </tr>
            ))}
            {runs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#666" }}>
                  No runs recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="cards">
        {runs.map((r) => (
          <div key={r.id} className="tile">
            <div className="card-header">
              <span className="ticker">{formatDateTime(r.started_at)}</span>
              <span className={statusClass(r.status)} style={{ fontWeight: 700 }}>
                {r.status}
              </span>
            </div>
            <div className="card-row">
              <span className="label">Completed</span>
              <span>{r.completed_at ? formatDateTime(r.completed_at) : "-"}</span>
            </div>
            {r.message && (
              <div style={{ marginTop: 8, fontSize: 13, color: "#9ca3af" }}>{r.message}</div>
            )}
          </div>
        ))}
        {runs.length === 0 && (
          <div className="tile" style={{ textAlign: "center", color: "#666" }}>
            No runs recorded yet
          </div>
        )}
      </div>
    </div>
  );
}
