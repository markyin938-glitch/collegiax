"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="ui-card p-8 text-center text-sm text-[var(--on-surface-variant)]">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const emailVerificationEnabled = process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_ENABLED !== "false";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  useEffect(() => {
    if (!emailVerificationEnabled) {
      router.replace("/login");
    }
  }, [emailVerificationEnabled, router]);

  if (!emailVerificationEnabled) {
    return <div className="ui-card p-8 text-center text-sm text-[var(--on-surface-variant)]">Redirecting...</div>;
  }

  async function verify() {
    const code = otp.join("");
    if (code.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otpCode: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setTimer(60);
    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  }

  function onChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  return (
    <div className="ui-card overflow-hidden">
      <div className="border-b border-[var(--outline-variant)] px-6 py-6 text-center sm:px-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[color:rgba(42,96,137,0.12)] text-[var(--primary)]">
          <Mail className="h-6 w-6" />
        </div>
        <p className="ui-eyebrow">Verify account</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-[var(--on-background)]">Check your inbox</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">Enter the six-digit verification code sent to your registered email address.</p>
        <div className="mt-4 inline-flex rounded-full bg-[color:rgba(42,96,137,0.12)] px-4 py-2 text-sm font-medium text-[var(--primary)]">
          {email}
        </div>
      </div>
      <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
        {error ? <div className="rounded-2xl bg-[var(--error-container)] px-4 py-3 text-sm text-[var(--error)]">{error}</div> : null}
        <div className="flex justify-center gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => onChange(i, e.target.value)}
              className="h-14 w-12 rounded-2xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-center text-xl font-semibold text-[var(--on-background)] focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(42,96,137,0.12)]"
            />
          ))}
        </div>
        <button onClick={verify} disabled={loading || otp.some((d) => !d)} className="ui-button ui-button-primary w-full justify-center">
          {loading ? "Verifying..." : "Verify email"}
        </button>
        <div className="text-center text-sm text-[var(--on-surface-variant)]">
          {timer > 0 ? (
            <span>Resend available in {timer}s</span>
          ) : (
            <button onClick={resend} className="font-semibold text-[var(--primary)] hover:underline">
              Resend code
            </button>
          )}
        </div>
        <div className="text-center text-sm text-[var(--on-surface-variant)]">
          <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
