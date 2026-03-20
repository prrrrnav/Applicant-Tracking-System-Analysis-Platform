import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";

export default function UploadBox({ onAnalyze, loading }) {
  const [jd, setJd] = useState("");
  const [auth, setAuth] = useState(() => localStorage.getItem("ats_auth") || "");
  const [file, setFile] = useState(null);

  const onDrop = useCallback((accepted) => {
    setFile(accepted?.[0] ?? null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    disabled: loading,
  });

  const fileMeta = useMemo(() => {
    if (!file) return null;
    return { name: file.name, size: file.size };
  }, [file]);

  const submit = async () => {
    if (!file || loading) return;
    localStorage.setItem("ats_auth", auth);
    await onAnalyze(file, jd, auth);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl border border-white/8 bg-[#111118]"
    >
      <div className="border-b border-white/5 px-6 py-4">
        <h2 className="text-sm font-bold text-white">Resume Analyzer</h2>
        <p className="mt-0.5 text-xs text-white/40">Upload your resume and optionally paste a job description for JD matching.</p>
      </div>

      <div className="flex flex-col gap-0 lg:flex-row">

        {/* Left — upload */}
        <div className="flex-1 p-6 lg:border-r lg:border-white/5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">Resume</p>
          <div
            {...getRootProps()}
            className={[
              "group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200",
              isDragActive
                ? "border-indigo-500/60 bg-indigo-500/5"
                : "border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/[0.03]",
              loading ? "cursor-not-allowed opacity-50" : "",
            ].join(" ")}
          >
            <input {...getInputProps()} />

            {fileMeta ? (
              <>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                  <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white">{fileMeta.name}</p>
                <p className="mt-1 text-xs text-white/30">{Math.ceil(fileMeta.size / 1024)} KB — click to replace</p>
              </>
            ) : (
              <>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-indigo-500/10">
                  <svg className="h-6 w-6 text-white/30 transition-colors group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white/70">
                  {isDragActive ? "Drop it here" : "Drag & drop or click to browse"}
                </p>
                <p className="mt-1 text-xs text-white/25">PDF, DOCX or TXT — max 5MB</p>
              </>
            )}
          </div>
        </div>

        {/* Right — JD + auth + submit */}
        <div className="flex flex-1 flex-col gap-5 p-6">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">Job Description <span className="normal-case font-normal text-white/20">(optional)</span></p>
            <textarea
              className="min-h-[140px] w-full resize-y rounded-xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white placeholder-white/20 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
              placeholder="Paste the job description here for keyword matching..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">Authorization <span className="normal-case font-normal text-white/20">(optional)</span></p>
            <input
              className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
              placeholder="Bearer token"
              value={auth}
              onChange={(e) => setAuth(e.target.value)}
              disabled={loading}
            />
            <p className="mt-1.5 text-xs text-white/20">
              Stored locally. Sent as the <span className="font-mono">Authorization</span> header.
            </p>
          </div>

          <button
            className={[
              "mt-auto flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-bold transition-all",
              loading || !file
                ? "cursor-not-allowed bg-white/5 text-white/20"
                : "bg-indigo-500 text-white hover:bg-indigo-400 active:scale-[0.98]",
            ].join(" ")}
            onClick={submit}
            disabled={loading || !file}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              "Analyze Resume"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}