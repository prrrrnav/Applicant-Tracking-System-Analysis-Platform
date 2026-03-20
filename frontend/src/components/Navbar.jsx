import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0F]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
            <span className="text-sm font-black text-white">R</span>
          </div>
          <span className="text-base font-bold tracking-tight text-white">ResumeAI</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Analyzer", to: "/analyze" },
            // { label: "Settings", to: "/settings" },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={[
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                pathname === to
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          to="/analyze"
          className="flex h-9 items-center rounded-lg bg-indigo-500 px-5 text-sm font-semibold text-white transition-all hover:bg-indigo-400 active:scale-[0.97]"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}