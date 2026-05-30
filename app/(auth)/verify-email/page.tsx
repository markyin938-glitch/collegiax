"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm text-center text-sm text-[var(--text2)]">Loading...</div>}>
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
    return <div className="w-full max-w-sm text-center text-sm text-[var(--text2)]">Redirecting...</div>;
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
    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  function onKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <div className="mb-4 inline-block text-5xl" style={{ animation: "mailBounce 2s ease-in-out infinite" }}>
          <Mail className="mx-auto text-[var(--accent)]" size={48} />
        </div>
        <h2 className="mb-2 text-xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>
          Verify your email
        </h2>
        <p className="text-xs text-[var(--text2)]">
          Enter the 6-digit code sent to
        </p>
        <div className="mt-2 rounded-[10px] border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-3 py-2 text-center text-xs font-medium text-[var(--accent)]" style={{ fontFamily: "var(--font-jetbrains)" }}>
          {email}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-[10px] border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="mb-4 flex justify-center gap-2.5">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            className="h-[60px] w-[52px] rounded-[var(--radius)] border-2 border-[var(--border2)] bg-[var(--surface)] text-center text-2xl font-bold text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:bg-[var(--accent)]/5 focus:ring-2 focus:ring-[var(--accent)]/20"
            style={{ fontFamily: "var(--font-jetbrains)", caretColor: "var(--accent)" }}
          />
        ))}
      </div>

      <button
        onClick={verify}
        disabled={loading || otp.some((d) => !d)}
        className="w-full rounded-[10px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:shadow-[var(--accent)]/50 disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      <div className="mt-3 text-center text-xs text-[var(--text2)]">
        {timer > 0 ? (
          <span>
            Resend in <span className="font-bold text-[var(--accent)]">{timer}s</span>
          </span>
        ) : (
          <button onClick={resend} className="text-[var(--accent)] hover:underline">
            Resend code
          </button>
        )}
      </div>

      <div className="mt-6 text-center text-xs text-[var(--text2)]">
        <Link href="/login" className="underline hover:text-[var(--text)]">
          Back to login
        </Link>
      </div>
    </div>
  );
}
