import { motion } from "framer-motion";

function scoreColor(n) {
  if (n >= 75) return { stroke: "#22c55e", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
  if (n >= 50) return { stroke: "#f59e0b", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
  return { stroke: "#ef4444", text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" };
}

function scoreLabel(n) {
  if (n >= 75) return "Strong Match";
  if (n >= 50) return "Partial Match";
  return "Needs Work";
}

function RingScore({ value }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(value, 100) / 100) * circ;
  const { stroke, text } = scoreColor(value);

  return (
    <div className="relative flex items-center justify-center">
      <svg width="136" height="136" viewBox="0 0 136 136">
        <circle cx="68" cy="68" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <motion.circle
          cx="68" cy="68" r={r} fill="none"
          stroke={stroke} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          transform="rotate(-90 68 68)"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-black ${text}`}>{value}</span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">ATS Score</span>
      </div>
    </div>
  );
}

function BarRow({ label, value }) {
  const normalized = value > 10 ? value : value * 10;
  const { stroke, text } = scoreColor(normalized);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-white/50">{label}</span>
        <span className={`font-bold tabular-nums ${text}`}>{normalized}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: stroke }}
          initial={{ width: 0 }}
          animate={{ width: `${normalized}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function Card({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/5 bg-[#111118]"
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="border-b border-white/5 px-6 py-4">
      <p className="text-xs font-bold uppercase tracking-widest text-white/30">{title}</p>
    </div>
  );
}

export default function AnalysisResults({ analysis }) {
  if (!analysis) return null;

  const { score, keywords, strengths, improvements, summary } = analysis;
  const total = score?.total ?? 0;
  const { bg, border, text } = scoreColor(total);

  const breakdownItems = [
    ["Skills Match", score?.skillsMatch],
    ["Experience", score?.experience],
    ["Education", score?.education],
    ["Certifications", score?.certifications],
    ["Formatting", score?.formatting],
    ["Keywords", score?.keywords],
  ].filter(([, v]) => v != null);

  const improvementsList = [
    ...(improvements?.skills ?? []).map((s) => ({ text: s, category: "Skills" })),
    ...(improvements?.experience ?? []).map((s) => ({ text: s, category: "Experience" })),
    ...(improvements?.formatting ?? []).map((s) => ({ text: s, category: "Formatting" })),
  ];

  return (
    <div className="space-y-4">

      {/* Score row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card delay={0}>
          <SectionHeader title="Overall Score" />
          <div className="flex flex-col items-center gap-4 p-8">
            <RingScore value={total} />
            <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${bg} ${text} ${border}`}>
              {scoreLabel(total)}
            </span>
            {summary && (
              <p className="max-w-xs text-center text-xs leading-relaxed text-white/40">{summary}</p>
            )}
          </div>
        </Card>

        <Card delay={0.05}>
          <SectionHeader title="Score Breakdown" />
          <div className="space-y-4 p-6">
            {breakdownItems.map(([label, value]) => (
              <BarRow key={label} label={label} value={value} />
            ))}
          </div>
        </Card>
      </div>

      {/* Keywords */}
      {(keywords?.matched?.length > 0 || keywords?.missing?.length > 0) && (
        <Card delay={0.1}>
          <SectionHeader title="Keyword Analysis" />
          <div className="p-6 space-y-5">
            {keywords.matched.length > 0 && (
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-white/20">
                  Matched ({keywords.matched.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {keywords.matched.map((k) => (
                    <span key={k} className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {keywords.missing.length > 0 && (
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-white/20">
                  Missing ({keywords.missing.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {keywords.missing.map((k) => (
                    <span key={k} className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Strengths + Improvements */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card delay={0.15}>
          <SectionHeader title="Strengths" />
          <ul className="space-y-3 p-6">
            {(strengths ?? []).map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-start gap-3 text-sm"
              >
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                <span className="text-white/60">{s}</span>
              </motion.li>
            ))}
          </ul>
        </Card>

        <Card delay={0.2}>
          <SectionHeader title="Improvements" />
          <ul className="space-y-3 p-6">
            {improvementsList.length === 0 ? (
              <p className="text-sm text-white/30">No improvements suggested.</p>
            ) : (
              improvementsList.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-start gap-3 text-sm"
                >
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  <span className="text-white/60">
                    <span className="font-semibold text-white/40">{item.category}: </span>
                    {item.text}
                  </span>
                </motion.li>
              ))
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}