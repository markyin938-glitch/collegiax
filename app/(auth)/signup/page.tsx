"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { signupMagicBentoItems } from "@/components/app/magic-bento-data";
import MagicBento from "@/components/MagicBento";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="ui-card p-8 text-center text-sm text-[var(--on-surface-variant)]">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const preselectedRole = roleParam === "clublead" || roleParam === "admin" ? roleParam : "student";

  const [name, setName] = useState("");
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: preselectedRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        router.push(data.redirectTo || `/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="ui-card overflow-hidden">
        <div className="border-b border-[var(--outline-variant)] px-6 py-6 sm:px-8">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-[0_12px_30px_rgba(42,96,137,0.22)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="ui-eyebrow">Create account</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-[var(--on-background)]">Join CollegiaX</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">
            Set up your campus account and enter the role-specific experience built for your workflow.
          </p>
          <div className="mt-4 inline-flex rounded-full bg-[color:rgba(42,96,137,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            {preselectedRole === "clublead" ? "Club Lead Sign Up" : preselectedRole === "admin" ? "Admin Sign Up" : "Student Sign Up"}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
          {error ? <div className="rounded-2xl bg-[var(--error-container)] px-4 py-3 text-sm text-[var(--error)]">{error}</div> : null}
          <label className="block space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
            Full name
            <input className="ui-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Sharma" required />
          </label>
          <label className="block space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
            Email
            <input className="ui-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" required type="email" />
          </label>
          <label className="block space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
            Password
            <div className="relative">
              <input
                className="ui-input pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                type={showPassword ? "text" : "password"}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] hover:text-[var(--primary)]">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          <button type="submit" disabled={loading} className="ui-button ui-button-primary w-full justify-center">
            {loading ? "Creating account..." : "Create account"}
            {!loading ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>

        <div className="border-t border-[var(--outline-variant)] px-6 py-5 text-sm text-[var(--on-surface-variant)] sm:px-8">
          Already have an account?{" "}
          <Link href={`/login?role=${preselectedRole}`} className="font-semibold text-[var(--primary)] hover:underline">
            Sign in
          </Link>
        </div>
      </div>

      <section className="ui-card p-5 sm:p-6">
        <div className="mb-4 space-y-2">
          <p className="ui-eyebrow">Before you enter</p>
          <h2 className="font-heading text-2xl font-semibold text-[var(--on-background)]">What your account unlocks</h2>
          <p className="text-sm leading-7 text-[var(--on-surface-variant)]">
            The Magic Bento panel now appears on signup too, giving new users a quick visual preview of the CollegiaX experience before they continue.
          </p>
        </div>
        <MagicBento
          items={signupMagicBentoItems}
          glowColor="74, 122, 155"
          enableTilt
          enableMagnetism={false}
          particleCount={8}
          spotlightRadius={220}
        />
      </section>
    </div>
  );
}
