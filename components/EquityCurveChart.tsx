"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { SummaryRow } from "@/lib/db";

export default function EquityCurveChart({ data }: { data: SummaryRow[] }) {
  const chartData = data.map((r) => ({
    date: r.date,
    value: r.total_value_holdings,
    invested: r.invested_capital,
  }));

  return (
    <div className="card p-4 sm:p-6">
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.32} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2432" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#1e2432" }}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              background: "#0d111a",
              border: "1px solid #1e2432",
              borderRadius: 12,
              fontSize: 13,
              boxShadow: "0 12px 40px -8px rgba(0,0,0,0.7)",
            }}
            labelStyle={{ color: "#e2e8f0", marginBottom: 4 }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} iconType="plainline" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#equityFill)"
            name="Portfolio Value"
          />
          <Line
            type="monotone"
            dataKey="invested"
            stroke="#64748b"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            name="Invested"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
