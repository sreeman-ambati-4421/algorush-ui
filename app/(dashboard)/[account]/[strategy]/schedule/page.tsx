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

function statusBadgeClass(status: string) {
  if (status === "SUCCESS") return "badge-positive";
  if (status === "FAILED") return "badge-negative";
  if (status === "RUNNING") return "badge-warning";
  return "badge-neutral";
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
      <div className="mb-8">
        <ScheduleForm accountId={params.account} strategy={params.strategy} initial={schedule} />
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Latest runs</h3>

      <div className="card hidden overflow-x-auto md:block">
        <table className="data-table">
          <thead>
            <tr>
              <th>Started</th>
              <th>Completed</th>
              <th>Status</th>
              <th className="text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id}>
                <td>{formatDateTime(r.started_at)}</td>
                <td>{r.completed_at ? formatDateTime(r.completed_at) : "-"}</td>
                <td>
                  <span className={statusBadgeClass(r.status)}>{r.status}</span>
                </td>
                <td className="!text-left whitespace-normal text-slate-400">{r.message ?? "-"}</td>
              </tr>
            ))}
            {runs.length === 0 && (
              <tr>
                <td colSpan={4} className="!text-center text-slate-500">
                  No runs recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {runs.map((r) => (
          <div key={r.id} className="card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">{formatDateTime(r.started_at)}</span>
              <span className={statusBadgeClass(r.status)}>{r.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Completed</span>
              <span className="text-slate-300">{r.completed_at ? formatDateTime(r.completed_at) : "-"}</span>
            </div>
            {r.message && <div className="mt-2 text-sm text-slate-500">{r.message}</div>}
          </div>
        ))}
        {runs.length === 0 && (
          <div className="card p-6 text-center text-slate-500">No runs recorded yet</div>
        )}
      </div>
    </div>
  );
}
