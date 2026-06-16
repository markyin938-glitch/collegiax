"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CalendarDays, Eye, EyeOff, ShieldCheck, Sparkles, Users2 } from "lucide-react";

const roleOptions = [
  {
    key: "student",
    label: "Student",
    description: "Events, clubs, and achievements",
    href: "/login?role=student",
    icon: CalendarDays,
  },
  {
    key: "clublead",
    label: "Club Lead",
    description: "Create and manage campus events",
    href: "/login?role=clublead",
    icon: Users2,
  },
  {
    key: "admin",
    label: "Admin",
    description: "Oversight, approvals, and analytics",
    href: "/login?role=admin",
    icon: ShieldCheck,
  },
] as const;

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="ui-card p-8 text-center text-sm text-[var(--on-surface-variant)]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const preselectedRole = searchParams.get("role") || "";
  const activeRole = preselectedRole === "clublead" || preselectedRole === "admin" ? preselectedRole : "student";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: activeRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        window.location.href = data.user?.role === "admin" ? "/admin" : "/dashboard";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ui-card overflow-hidden">
      <div className="border-b border-[var(--outline-variant)] px-6 py-6 sm:px-8">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-[0_12px_30px_rgba(42,96,137,0.22)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="ui-eyebrow">Authentication</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-[var(--on-background)]">Sign in to CollegiaX</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">
          Continue into your campus workspace for events, clubs, participation tracking, and AI-powered recommendations.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {roleOptions.map((role) => {
            const Icon = role.icon;
            const active = activeRole === role.key;

            return (
              <Link
                key={role.key}
                href={role.href}
                className={`rounded-[1.1rem] border px-4 py-4 text-left transition ${
                  active
                    ? "border-[var(--primary)] bg-[color:rgba(42,96,137,0.10)] shadow-[0_12px_24px_rgba(42,96,137,0.08)]"
                    : "border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] hover:border-[var(--primary)] hover:bg-[color:rgba(42,96,137,0.04)]"
                }`}
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-container-low)] text-[var(--primary)]"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="font-heading text-lg font-semibold text-[var(--on-background)]">{role.label}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--on-surface-variant)]">{role.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
        {error ? <div className="rounded-2xl bg-[var(--error-container)] px-4 py-3 text-sm text-[var(--error)]">{error}</div> : null}
        <div className="rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-4 py-3 text-xs leading-6 text-[var(--on-surface-variant)]">
          {activeRole === "admin"
            ? "Admin account: admin@collegiax.app / admin123"
            : activeRole === "clublead"
              ? "Club lead account: lead@collegiax.app / lead1234"
              : "Student account: student@collegiax.app / student123"}
        </div>
        <label className="block space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            className="ui-input"
          />
        </label>
        <label className="block space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
          Password
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="ui-input pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] hover:text-[var(--primary)]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--on-surface-variant)]">Protected by secure campus authentication</span>
          <Link href="/forgot-password" className="font-medium text-[var(--primary)] hover:underline">
            Forgot password?
          </Link>
        </div>
        <button type="submit" disabled={loading} className="ui-button ui-button-primary w-full justify-center">
          {loading ? "Signing in..." : "Sign in"}
          {!loading ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </form>

      <div className="border-t border-[var(--outline-variant)] px-6 py-5 text-sm text-[var(--on-surface-variant)] sm:px-8">
        Don&apos;t have an account?{" "}
        <Link href={`/signup?role=${activeRole}`} className="font-semibold text-[var(--primary)] hover:underline">
          Create one
        </Link>
      </div>
    </div>
  );
}
