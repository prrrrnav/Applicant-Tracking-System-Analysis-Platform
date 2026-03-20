import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import ResumeCompare from "../components/ResumeCompare";
import { useATS } from "../hooks/useATS";
import AnalysisResults from "../components/AnalysisResults";
import { downloadOptimizedResume } from "../utils/downloadResume";

function Loader({ label }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-indigo-500" />
      </div>
      <p className="text-sm font-medium text-white/40">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { loading, error, data, analyze, optimize } = useATS();
  const [showRaw, setShowRaw] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const analysisResult = data?.analysis ?? null;
  const optimizedResume = data?.optimizedResume ?? null;
  const canOptimize = useMemo(() => Boolean(analysisResult) && !optimizedResume, [analysisResult, optimizedResume]);

  const handleOptimize = async () => {
    setOptimizing(true);
    try { await optimize(); } finally { setOptimizing(false); }
  };

  const handleDownload = async () => {
    if (!optimizedResume) return;
    setDownloading(true);
    try { await downloadOptimizedResume(optimizedResume); } finally { setDownloading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl space-y-4 px-6 py-8">
        <UploadBox onAnalyze={analyze} loading={loading} />

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-400"
          >
            {error}
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-white/5 bg-[#111118]">
            <Loader label={optimizing ? "Generating optimized resume..." : "Analyzing resume against job description..."} />
          </div>
        )}

        {/* Results */}
        {!loading && analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <AnalysisResults analysis={analysisResult} />

            {/* Optimize CTA */}
            {!optimizedResume && (
              <div className="flex justify-end">
                <button
                  disabled={!canOptimize}
                  onClick={handleOptimize}
                  className={[
                    "rounded-xl px-6 py-3 text-sm font-bold transition-all",
                    canOptimize
                      ? "bg-indigo-500 text-white hover:bg-indigo-400 active:scale-[0.98]"
                      : "cursor-not-allowed bg-white/5 text-white/20",
                  ].join(" ")}
                >
                  Generate Optimized Resume
                </button>
              </div>
            )}

            {/* Optimized resume */}
            {optimizedResume && <ResumeCompare optimizedResume={optimizedResume} />}

            {/* Download */}
            <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-white/5 bg-[#111118] p-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold text-white">Download optimized resume</p>
                <p className="mt-0.5 text-xs text-white/30">
                  {optimizedResume
                    ? "Your AI-optimized resume is ready — downloads as a .docx file."
                    : "Generate an optimized resume first using the button above."}
                </p>
              </div>
              <button
                disabled={!optimizedResume || downloading}
                onClick={handleDownload}
                className={[
                  "rounded-xl px-5 py-2.5 text-sm font-bold transition-all",
                  optimizedResume && !downloading
                    ? "bg-white text-slate-900 hover:bg-white/90 active:scale-[0.98]"
                    : "cursor-not-allowed bg-white/5 text-white/20",
                ].join(" ")}
              >
                {downloading ? "Preparing..." : "Download .docx"}
              </button>
            </div>

            {/* Raw JSON panel */}
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#111118]">
              <button
                onClick={() => setShowRaw((v) => !v)}
                className="flex w-full items-center justify-between px-6 py-4 text-sm transition-colors hover:bg-white/[0.02]"
              >
                <span className="flex items-center gap-2 font-medium text-white/40">
                  <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-xs text-white/30">JSON</span>
                  Raw API Response
                </span>
                <span className="text-xs text-white/20">{showRaw ? "Hide" : "Show"}</span>
              </button>
              {showRaw && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-white/5"
                >
                  <pre className="max-h-[400px] overflow-auto p-5 font-mono text-xs leading-relaxed text-white/40">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && !analysisResult && (
          <div className="rounded-2xl border border-dashed border-white/5 p-16 text-center">
            <p className="text-sm text-white/20">Upload a resume above to get your ATS score, keyword analysis, and optimized output.</p>
          </div>
        )}
      </main>
    </div>
  );
}