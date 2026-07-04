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
} from "recharts";
import type { SummaryRow } from "@/lib/db";

export default function EquityCurveChart({ data }: { data: SummaryRow[] }) {
  const chartData = data.map((r) => ({
    date: r.date,
    value: r.total_value_holdings,
    invested: r.invested_capital,
  }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#22262f" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} minTickGap={40} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} width={80} />
        <Tooltip contentStyle={{ background: "#151821", border: "1px solid #22262f" }} />
        <Area type="monotone" dataKey="value" stroke="#4472c4" fill="#4472c433" name="Portfolio Value" />
        <Line type="monotone" dataKey="invested" stroke="#9ca3af" strokeDasharray="4 4" dot={false} name="Invested" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
