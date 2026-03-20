import { motion } from "framer-motion";

function scoreTone(score) {
  if (score == null) return { label: "—", bar: "bg-slate-200", text: "text-slate-900" };
  if (score >= 85) return { label: "Excellent", bar: "bg-emerald-500", text: "text-emerald-700" };
  if (score >= 70) return { label: "Good", bar: "bg-indigo-600", text: "text-indigo-700" };
  if (score >= 50) return { label: "Fair", bar: "bg-amber-500", text: "text-amber-700" };
  return { label: "Needs work", bar: "bg-rose-500", text: "text-rose-700" };
}

export default function ScoreCard({ score }) {
  const tone = scoreTone(score);
  const pct = Math.max(0, Math.min(100, Number(score ?? 0)));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">ATS Score</div>
          <div className="mt-2 flex items-end gap-2">
            <div className="text-5xl font-black tracking-tight text-slate-900">{score ?? "—"}</div>
            <div className="pb-2 text-sm font-semibold text-slate-400">/ 100</div>
          </div>
        </div>
        <div className={["rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold", tone.text].join(" ")}>
          {tone.label}
        </div>
      </div>

      <div className="mt-6">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className={["h-full rounded-full", tone.bar].join(" ")}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}

