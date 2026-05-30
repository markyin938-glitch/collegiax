"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, GraduationCap, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm text-center text-sm text-[var(--text2)]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const preselectedRole = searchParams.get("role") || "";
  const demoLoginEnabled = process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED !== "false";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function demoLogin(role: "student" | "clublead" | "admin") {
    setError("");
    setDemoLoading(role);
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Demo login failed");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setDemoLoading("");
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <div className="mb-2 inline-flex items-center gap-2 text-2xl font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
          <Sparkles className="text-[var(--accent)]" size={24} />
          Collegia<span className="text-[var(--accent)]">X</span>
        </div>
        {preselectedRole && (
          <div
            className="mt-2 inline-block rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest"
            style={{ fontFamily: "var(--font-jetbrains)" }}
          >
            {preselectedRole === "clublead" ? "Club Lead Portal" : preselectedRole === "admin" ? "Admin Portal" : "Student Portal"}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="rounded-[10px] border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--text2)]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            className="w-full rounded-[10px] border border-[var(--border2)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[var(--text2)]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-[10px] border border-[var(--border2)] bg-[var(--surface)] px-3.5 py-2.5 pr-10 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)]"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[10px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:shadow-[var(--accent)]/50 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-4 text-center text-xs text-[var(--text2)]">
        <Link href="/forgot-password" className="underline hover:text-[var(--text)]">
          Forgot password?
        </Link>
      </div>

      {demoLoginEnabled && (
        <div className="mt-5 border-t border-[var(--border2)] pt-5">
          <div className="mb-3 text-center text-[11px] font-semibold uppercase tracking-widest text-[var(--text3)]" style={{ fontFamily: "var(--font-jetbrains)" }}>
            Demo Login
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => demoLogin("student")}
              disabled={!!demoLoading || loading}
              className="flex h-12 items-center justify-center rounded-[10px] border border-[var(--border2)] bg-[var(--surface)] text-[var(--text2)] transition hover:border-[var(--accent)] hover:text-[var(--text)] disabled:opacity-60"
              title="Student demo"
              aria-label="Student demo login"
            >
              {demoLoading === "student" ? "..." : <GraduationCap size={18} />}
            </button>
            <button
              type="button"
              onClick={() => demoLogin("clublead")}
              disabled={!!demoLoading || loading}
              className="flex h-12 items-center justify-center rounded-[10px] border border-[var(--border2)] bg-[var(--surface)] text-[var(--text2)] transition hover:border-[var(--accent)] hover:text-[var(--text)] disabled:opacity-60"
              title="Club lead demo"
              aria-label="Club lead demo login"
            >
              {demoLoading === "clublead" ? "..." : <UsersRound size={18} />}
            </button>
            <button
              type="button"
              onClick={() => demoLogin("admin")}
              disabled={!!demoLoading || loading}
              className="flex h-12 items-center justify-center rounded-[10px] border border-[var(--border2)] bg-[var(--surface)] text-[var(--text2)] transition hover:border-[var(--accent)] hover:text-[var(--text)] disabled:opacity-60"
              title="Admin demo"
              aria-label="Admin demo login"
            >
              {demoLoading === "admin" ? "..." : <ShieldCheck size={18} />}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-[var(--text2)]">
        Don&apos;t have an account?{" "}
        <Link href={`/signup${preselectedRole ? `?role=${preselectedRole}` : ""}`} className="font-semibold text-[var(--accent)] hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
