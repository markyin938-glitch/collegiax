"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

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
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <div className="mb-2 inline-flex items-center gap-2 text-2xl font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
          <Sparkles className="text-[var(--accent)]" size={24} />
          Collegia<span className="text-[var(--accent)]">X</span>
        </div>
        <h2 className="mt-3 text-lg font-bold">Reset Password</h2>
        <p className="mt-1 text-xs text-[var(--text2)]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {sent ? (
        <div className="rounded-[10px] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-6 text-center text-sm text-[var(--text)]">
          If an account exists for <strong>{email}</strong>, you will receive a password reset email shortly.
        </div>
      ) : (
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
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[10px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:shadow-[var(--accent)]/50 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-xs text-[var(--text2)]">
        <Link href="/login" className="underline hover:text-[var(--text)]">
          Back to login
        </Link>
      </div>
    </div>
  );
}
