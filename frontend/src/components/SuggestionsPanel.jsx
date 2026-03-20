import { motion } from "framer-motion";

export default function SuggestionsPanel({ suggestions }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <div className="text-sm font-medium text-slate-500">Improvements</div>
        <div className="text-lg font-bold text-slate-900">Suggestions</div>
      </div>

      {(suggestions ?? []).length ? (
        <div className="space-y-3">
          {suggestions.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.25) }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Original</div>
                  <div className="text-sm text-slate-700">{s?.original ?? "—"}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Improved</div>
                  <div className="text-sm font-medium text-slate-900">{s?.improved ?? "—"}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          Suggestions will appear here after analysis.
        </div>
      )}
    </div>
  );
}

