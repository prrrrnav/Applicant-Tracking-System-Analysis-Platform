import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const USERS_KEY = "resumeai_users";
const SESSION_KEY = "resumeai_session";

type User = { name: string; email: string; salt: string; passwordHash: string };

function readUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  return toHex(await crypto.subtle.digest("SHA-256", data));
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(searchParams.get("mode") === "signup" ? "signup" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    const users = readUsers();

    if (!normalizedEmail || password.length < 8) {
      setError("Use a valid email and an 8-character password.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Add your name.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        if (users.some((user) => user.email === normalizedEmail)) throw new Error("An account already exists.");

        const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
        const passwordHash = await hashPassword(password, salt);
        localStorage.setItem(USERS_KEY, JSON.stringify([...users, { name: name.trim(), email: normalizedEmail, salt, passwordHash }]));
      } else {
        const user = users.find((candidate) => candidate.email === normalizedEmail);
        if (!user || user.passwordHash !== await hashPassword(password, user.salt)) {
          throw new Error("Email or password is incorrect.");
        }
      }

      localStorage.setItem(SESSION_KEY, normalizedEmail);
      navigate("/analyze", { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to continue.");
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (nextMode: "login" | "signup") => {
    setMode(nextMode);
    setError("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0F] px-6 py-10 text-white">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/8 bg-[#111118] p-7 shadow-2xl"
      >
        <Link to="/" className="mb-8 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-black">R</span>
          <span className="font-bold tracking-tight">ResumeAI</span>
        </Link>

        <div className="mb-6 flex rounded-lg border border-white/8 bg-white/[0.03] p-1">
          {(["login", "signup"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => switchMode(tab)}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${mode === tab ? "bg-indigo-500 text-white" : "text-white/40 hover:text-white"}`}
            >
              {tab === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        <h1 className="text-2xl font-black">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-1 text-sm text-white/40">Your account stays on this device.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              autoComplete="name"
              className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-indigo-500/50"
            />
          )}
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            autoComplete="email"
            className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-indigo-500/50"
          />
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-indigo-500/50"
          />
          {mode === "signup" && (
            <input
              required
              type="password"
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              autoComplete="new-password"
              className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-indigo-500/50"
            />
          )}

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            disabled={busy}
            className="w-full rounded-xl bg-indigo-500 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>
      </motion.section>
    </main>
  );
}

export { SESSION_KEY };
