"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm text-center text-sm text-[var(--text2)]">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <p className="text-sm text-[var(--text2)]">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <div className="mb-2 inline-flex items-center gap-2 text-2xl font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
          <Sparkles className="text-[var(--accent)]" size={24} />
          Collegia<span className="text-[var(--accent)]">X</span>
        </div>
        <h2 className="mt-3 text-lg font-bold">Set New Password</h2>
      </div>

      {success ? (
        <div className="rounded-[10px] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-4 py-6 text-center text-sm text-[var(--text)]">
          Password reset successful.{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            Sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="rounded-[10px] border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--text2)]">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              className="w-full rounded-[10px] border border-[var(--border2)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[10px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:shadow-[var(--accent)]/50 disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}
