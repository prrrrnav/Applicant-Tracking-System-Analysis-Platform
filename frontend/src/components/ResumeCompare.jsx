import { motion } from "framer-motion";

function SectionHeader({ title }) {
  return (
    <div className="mb-4 border-b border-white/5 pb-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/25">{title}</p>
    </div>
  );
}

function Bullet({ text }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-white/60 leading-relaxed">
      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400" />
      {text}
    </li>
  );
}

function Tag({ label }) {
  return (
    <span className="inline-flex rounded-md border border-white/8 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/60">
      {label}
    </span>
  );
}

export default function ResumeCompare({ optimizedResume: r }) {
  if (!r) return null;

  const skillGroups = r.skills
    ? Object.entries(r.skills).map(([key, values]) => ({
        label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        items: Array.isArray(values) ? values : [values],
      }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl border border-white/5 bg-[#111118]"
    >
      {/* Header */}
      <div className="border-b border-white/5 bg-indigo-500/10 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">AI Optimized</p>
            <h2 className="mt-0.5 text-lg font-black text-white">Your Optimized Resume</h2>
          </div>
          <span className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300">
            ATS Ready
          </span>
        </div>
      </div>

      <div className="p-8 space-y-8">

        {/* Name + Title + Contact */}
        <div className="border-b border-white/5 pb-6">
          <h1 className="text-3xl font-black tracking-tight text-white">{r.name ?? "—"}</h1>
          {r.title && <p className="mt-1 text-sm font-semibold text-indigo-400">{r.title}</p>}
          {r.contact && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/30">
              {r.contact.location && <span>{r.contact.location}</span>}
              {r.contact.phone && <span>{r.contact.phone}</span>}
              {r.contact.email && <span>{r.contact.email}</span>}
              {r.contact.github && (
                <a href={r.contact.github} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  GitHub
                </a>
              )}
              {r.contact.linkedin && (
                <a href={r.contact.linkedin} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        {r.summary && (
          <div>
            <SectionHeader title="Professional Summary" />
            <p className="text-sm leading-relaxed text-white/60">{r.summary}</p>
          </div>
        )}

        {/* Skills */}
        {skillGroups.length > 0 && (
          <div>
            <SectionHeader title="Technical Skills" />
            <div className="space-y-2.5">
              {skillGroups.map(({ label, items }) => (
                <div key={label} className="flex flex-wrap items-start gap-2">
                  <span className="w-28 flex-shrink-0 text-xs font-bold text-white/25">{label}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item) => <Tag key={item} label={item} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {r.experience?.length > 0 && (
          <div>
            <SectionHeader title="Professional Experience" />
            <div className="space-y-6">
              {r.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex flex-wrap items-start justify-between gap-1 mb-2">
                    <div>
                      <p className="text-sm font-bold text-white">{exp.role}</p>
                      <p className="text-xs font-semibold text-indigo-400">{exp.company}</p>
                    </div>
                    {exp.period && <span className="text-xs text-white/25">{exp.period}</span>}
                  </div>
                  <ul className="space-y-2">
                    {exp.bullets?.map((b, j) => <Bullet key={j} text={b} />)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {r.projects?.length > 0 && (
          <div>
            <SectionHeader title="Technical Projects" />
            <div className="space-y-6">
              {r.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex flex-wrap items-start justify-between gap-1 mb-2">
                    <div>
                      <p className="text-sm font-bold text-white">{proj.name}</p>
                      {proj.stack?.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {proj.stack.map((s) => <Tag key={s} label={s} />)}
                        </div>
                      )}
                    </div>
                    {proj.period && <span className="text-xs text-white/25">{proj.period}</span>}
                  </div>
                  <ul className="space-y-2 mt-2">
                    {proj.bullets?.map((b, j) => <Bullet key={j} text={b} />)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {r.education?.length > 0 && (
          <div>
            <SectionHeader title="Education" />
            <div className="space-y-3">
              {r.education.map((edu, i) => (
                <div key={i} className="flex flex-wrap items-start justify-between gap-1">
                  <div>
                    <p className="text-sm font-bold text-white">{edu.degree}</p>
                    <p className="text-xs text-white/40">{edu.institution}{edu.location ? ` · ${edu.location}` : ""}</p>
                  </div>
                  {edu.period && <span className="text-xs text-white/25">{edu.period}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {r.certifications?.length > 0 && (
          <div>
            <SectionHeader title="Certifications" />
            <ul className="space-y-1.5">
              {r.certifications.map((c, i) => (
                <li key={i} className="text-sm text-white/50">— {c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Achievements */}
        {r.achievements?.length > 0 && (
          <div>
            <SectionHeader title="Achievements" />
            <ul className="space-y-1.5">
              {r.achievements.map((a, i) => (
                <li key={i} className="text-sm text-white/50">— {a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}