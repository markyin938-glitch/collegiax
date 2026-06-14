"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong.");
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
        <p className="ui-eyebrow">Password reset</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-[var(--on-background)]">Recover access</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">
          Enter your campus email and we&apos;ll send reset instructions if the account exists.
        </p>
      </div>
      <div className="px-6 py-6 sm:px-8 sm:py-8">
        {sent ? (
          <div className="rounded-[1.25rem] bg-[color:rgba(42,96,137,0.09)] px-5 py-5 text-sm leading-7 text-[var(--on-surface)]">
            If an account exists for <strong>{email}</strong>, reset instructions will arrive shortly.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {error ? <div className="rounded-2xl bg-[var(--error-container)] px-4 py-3 text-sm text-[var(--error)]">{error}</div> : null}
            <label className="block space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
              Email
              <input className="ui-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@university.edu" />
            </label>
            <button type="submit" disabled={loading} className="ui-button ui-button-primary w-full justify-center">
              {loading ? "Sending..." : "Send reset link"}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
        )}
      </div>
      <div className="border-t border-[var(--outline-variant)] px-6 py-5 text-sm text-[var(--on-surface-variant)] sm:px-8">
        <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
