import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

const testimonials = [
  {
    name: "Alex Thompson",
    title: "Software Engineer — Stripe",
    quote:
      "The AI matching score is a game changer. I realized I was missing key terminology that recruiters were looking for. Got an interview within a week of updating my resume.",
  },
  {
    name: "Sarah Chen",
    title: "Product Manager — Meta",
    quote:
      "ResumeAI helped me quantify my achievements. Instead of listing tasks, it suggested ways to show my actual business impact. Highly recommend.",
  },
];

const features = [
  {
    label: "01",
    title: "ATS Score Analysis",
    body: "Instant scoring across 6 dimensions — skills, experience, education, certifications, formatting, and keywords.",
  },
  {
    label: "02",
    title: "Job-Match Intelligence",
    body: "Paste any job description and see exactly which keywords you hit and which ones you are missing.",
  },
  {
    label: "03",
    title: "AI Resume Rewrite",
    body: "Get a fully rewritten, ATS-optimized resume with strong action verbs and quantified impact — ready to download.",
  },
];

const steps = [
  { n: "1", title: "Upload your resume", body: "PDF, DOCX, or plain text — we parse everything." },
  { n: "2", title: "Paste the job description", body: "Drop in the JD and let the AI do the matching work." },
  { n: "3", title: "Get your report", body: "Score, keyword gaps, strengths, and a rewritten resume in seconds." },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0F]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
              <span className="text-sm font-black tracking-tighter">R</span>
            </div>
            <span className="text-base font-bold tracking-tight text-white">ResumeAI</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {["Features", "How it works", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm font-medium text-white/50 transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            
            <Link
              to="/analyze"
              className="flex h-9 items-center rounded-lg bg-indigo-500 px-5 text-sm font-semibold text-white transition-all hover:bg-indigo-400"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>

        {/* ── Hero ── */}
        <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-28 text-center">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden">
            <div className="h-[500px] w-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />
          </div>

          <motion.div {...fadeUp(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-400" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">AI-Powered JD Matching</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="mb-6 max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-white lg:text-7xl"
          >
            Land your dream job with{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              AI-powered
            </span>{" "}
            resume analysis
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="mb-10 max-w-xl text-base leading-relaxed text-white/50 lg:text-lg">
            Instant ATS scoring, keyword gap analysis, and a fully rewritten resume — in seconds, not days.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/analyze"
              className="rounded-xl bg-indigo-500 px-8 py-4 text-base font-bold text-white transition-all hover:bg-indigo-400 hover:scale-[1.02] active:scale-[0.98]"
            >
              Analyze My Resume
            </Link>
            <Link
              to="/analyze"
              className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-white/80 transition-all hover:bg-white/10"
            >
              See How It Works
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div {...fadeUp(0.4)} className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {[["10k+", "Resumes analyzed"], ["3x", "More interviews"], ["92%", "Success rate"]].map(([stat, label]) => (
              <div key={stat} className="text-center">
                <div className="text-2xl font-black text-white">{stat}</div>
                <div className="text-xs font-medium text-white/40">{label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Preview card ── */}
        <section className="px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#111118] shadow-2xl"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="ml-4 flex-1 rounded-md bg-white/5 px-3 py-1 text-xs text-white/20">
                resumeai.app/analyze
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6 lg:flex-row">
              {/* Left — skeleton resume */}
              <div className="flex-1 space-y-3 opacity-30">
                <div className="h-6 w-40 rounded-lg bg-white/20" />
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-4/5 rounded bg-white/10" />
                <div className="mt-4 h-4 w-24 rounded bg-white/20" />
                <div className="space-y-2 pt-1">
                  {[1, 1, 0.7].map((w, i) => (
                    <div key={i} className="h-3 rounded bg-white/10" style={{ width: `${w * 100}%` }} />
                  ))}
                </div>
                <div className="mt-4 h-4 w-28 rounded bg-white/20" />
                <div className="space-y-2 pt-1">
                  {[1, 0.9, 0.8].map((w, i) => (
                    <div key={i} className="h-3 rounded bg-white/10" style={{ width: `${w * 100}%` }} />
                  ))}
                </div>
              </div>

              {/* Right — score panel */}
              <div className="flex flex-col gap-4 lg:w-72">
                <div className="flex flex-col items-center rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-6 text-center">
                  <div className="relative mb-3 h-28 w-28">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <circle
                        cx="60" cy="60" r="52" fill="none"
                        stroke="#6366f1" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="326.7"
                        strokeDashoffset="49"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-white">85</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">ATS Score</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-white/60">Strong match for "Senior Engineer"</p>
                </div>

                <div className="space-y-2">
                  {[
                    { label: "Skills Match", val: 90, color: "bg-emerald-500" },
                    { label: "Keywords", val: 78, color: "bg-amber-500" },
                    { label: "Formatting", val: 95, color: "bg-indigo-500" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="font-medium text-white/60">{label}</span>
                        <span className="font-bold text-white">{val}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-400">Process</p>
              <h2 className="text-3xl font-black text-white lg:text-5xl">Three steps to a better resume</h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-px bg-white/5 rounded-2xl overflow-hidden md:grid-cols-3">
              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0A0A0F] p-8"
                >
                  <div className="mb-6 text-5xl font-black text-white/5">{s.n}</div>
                  <h3 className="mb-2 text-lg font-bold text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-white/40">{s.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-400">Features</p>
              <h2 className="text-3xl font-black text-white lg:text-5xl">Built for modern hiring</h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-2xl border border-white/5 bg-[#111118] p-8 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/5"
                >
                  <div className="mb-6 text-xs font-black uppercase tracking-widest text-indigo-500">{f.label}</div>
                  <h3 className="mb-3 text-xl font-bold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-white/40">{f.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-400">Testimonials</p>
              <h2 className="text-3xl font-black text-white lg:text-5xl">What candidates say</h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-white/5 bg-[#111118] p-8"
                >
                  <p className="mb-8 text-base leading-relaxed text-white/70">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-black text-indigo-400">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs text-white/40">{t.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-black text-white lg:text-5xl">Ready to stand out?</h2>
            <p className="mb-8 text-base text-white/50">Upload your resume and get your ATS score in under 30 seconds.</p>
            <Link
              to="/analyze"
              className="inline-flex h-12 items-center rounded-xl bg-indigo-500 px-8 text-base font-bold text-white transition-all hover:bg-indigo-400 hover:scale-[1.02] active:scale-[0.98]"
            >
              Analyze My Resume
            </Link>
          </motion.div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 py-16 text-white/30">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
                  <span className="text-sm font-black text-white">R</span>
                </div>
                <span className="text-base font-bold text-white">ResumeAI</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed">
                Empowering job seekers with the same technology recruiters use.
              </p>
            </div>

            {[
              { title: "Product", links: [{ label: "Analyzer", to: "/analyze" }, { label: "Optimize", to: "/analyze" }, { label: "Status", to: "/#" }] },
              { title: "Company", links: [{ label: "Features", href: "#features" }, { label: "Testimonials", href: "#testimonials" }, { label: "GitHub", href: "https://github.com/prrrrnav/" }] },
              { title: "Legal", links: [{ label: "Settings", to: "/settings" }, { label: "Privacy", href: "#" }, { label: "Terms", href: "#" }] },
            ].map((col) => (
              <div key={col.title}>
                <h5 className="mb-4 text-sm font-bold text-white">{col.title}</h5>
                <ul className="space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.to ? (
                        <Link className="transition-colors hover:text-white" to={l.to}>{l.label}</Link>
                      ) : (
                        <a className="transition-colors hover:text-white" href={l.href}>{l.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs md:flex-row">
            <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
            <div className="flex gap-6">
              {["Twitter", "LinkedIn", "YouTube"].map((s) => (
                <a key={s} className="hover:text-white transition-colors" href="#">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}