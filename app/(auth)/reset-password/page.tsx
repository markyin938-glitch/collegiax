"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="ui-card p-8 text-center text-sm text-[var(--on-surface-variant)]">Loading...</div>}>
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
      <div className="ui-card p-8 text-center">
        <p className="text-sm text-[var(--on-surface-variant)]">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm font-semibold text-[var(--primary)] hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="ui-card overflow-hidden">
      <div className="border-b border-[var(--outline-variant)] px-6 py-6 sm:px-8">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-[0_12px_30px_rgba(42,96,137,0.22)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="ui-eyebrow">Reset password</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-[var(--on-background)]">Choose a new password</h1>
      </div>
      <div className="px-6 py-6 sm:px-8 sm:py-8">
        {success ? (
          <div className="rounded-[1.25rem] bg-[color:rgba(42,96,137,0.09)] px-5 py-5 text-sm leading-7 text-[var(--on-surface)]">
            Password reset successful.{" "}
            <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
              Return to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {error ? <div className="rounded-2xl bg-[var(--error-container)] px-4 py-3 text-sm text-[var(--error)]">{error}</div> : null}
            <label className="block space-y-2 text-sm font-medium text-[var(--on-surface-variant)]">
              New password
              <input
                className="ui-input"
                type="password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </label>
            <button type="submit" disabled={loading} className="ui-button ui-button-primary w-full justify-center">
              {loading ? "Resetting..." : "Reset password"}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
