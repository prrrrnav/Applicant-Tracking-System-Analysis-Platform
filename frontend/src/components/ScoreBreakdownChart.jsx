import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ScoreBreakdownChart({ breakdown }) {
  const data = [
    { name: "Keywords", value: breakdown?.keywords ?? 0 },
    { name: "Impact", value: breakdown?.impact ?? 0 },
    { name: "Action", value: breakdown?.action ?? 0 },
    { name: "System", value: breakdown?.system ?? 0 },
    { name: "JD Match", value: breakdown?.jdMatch ?? 0 },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-500">Score breakdown</div>
          <div className="text-lg font-bold text-slate-900">Category performance</div>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
            <YAxis tick={{ fontSize: 12 }} stroke="#64748b" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
              }}
            />
            <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

