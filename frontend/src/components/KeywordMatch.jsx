function Tag({ children, tone = "neutral" }) {
  const cls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "bad"
        ? "border-rose-200 bg-rose-50 text-rose-800"
        : "border-slate-200 bg-slate-50 text-slate-700";
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${cls}`}>{children}</span>;
}

export default function KeywordMatch({ matchedKeywords, missingKeywords }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <div className="text-sm font-medium text-slate-500">Keyword match</div>
        <div className="text-lg font-bold text-slate-900">Coverage</div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-2 text-sm font-semibold text-slate-800">Matched</div>
          <div className="flex flex-wrap gap-2">
            {(matchedKeywords ?? []).length ? (
              matchedKeywords.map((k) => (
                <Tag key={`m-${k}`} tone="good">
                  {k}
                </Tag>
              ))
            ) : (
              <div className="text-sm text-slate-500">No matched keywords yet.</div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-slate-800">Missing</div>
          <div className="flex flex-wrap gap-2">
            {(missingKeywords ?? []).length ? (
              missingKeywords.map((k) => (
                <Tag key={`x-${k}`} tone="bad">
                  {k}
                </Tag>
              ))
            ) : (
              <div className="text-sm text-slate-500">No missing keywords.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

