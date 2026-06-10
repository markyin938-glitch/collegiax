"use client";

import Link from "next/link";
import { useThemeStore } from "@/stores/theme-store";
import { Moon, Sun, Sparkles, GraduationCap, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const { theme, toggle } = useThemeStore();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="grad-mesh absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center,black 30%,transparent 80%)",
        }}
      />
      <div
        className="absolute h-[500px] w-[500px] rounded-full blur-[60px]"
        style={{
          background: "linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1),rgba(6,182,212,.08))",
          animation: "blobFloat 8s ease-in-out infinite, float 6s ease-in-out infinite",
        }}
      />

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="absolute top-5 right-5 z-10 flex items-center gap-2 rounded-full border border-[var(--border2)] bg-white/5 px-4 py-2 text-sm text-[var(--text)] backdrop-blur-md transition hover:bg-[var(--accent)]/15 hover:border-[var(--accent)]"
      >
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
      </button>

      <div className="relative z-[2] flex w-full max-w-[860px] flex-col items-center px-5 py-10 text-center">
        {/* Logo */}
        <div className="mb-6 inline-flex items-center gap-2 sm:mb-8 sm:gap-3" style={{ animation: "float 4s ease-in-out infinite" }}>
          <div className="relative flex h-12 w-12 items-center justify-center rounded-[14px] text-[22px] text-white sm:h-16 sm:w-16 sm:rounded-[18px] sm:text-[28px]"
            style={{
              background: "linear-gradient(135deg,var(--accent),var(--accent2))",
              boxShadow: "0 0 40px rgba(99,102,241,.4)",
            }}
          >
            <Sparkles size={20} className="sm:hidden" />
            <Sparkles size={24} className="hidden sm:block" />
            <span
              className="absolute -inset-2 rounded-[26px] border border-[var(--accent)]/30"
              style={{ animation: "pulse-ring 2s ease-out infinite" }}
            />
          </div>
          <span
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Collegia<span className="text-[var(--accent)]">X</span>
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-3 text-3xl font-extrabold tracking-tight sm:mb-4 sm:text-5xl md:text-6xl"
          style={{
            fontFamily: "var(--font-syne)",
            background: "linear-gradient(180deg,#fff 0%,rgba(255,255,255,.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          The Intelligent Campus Ecosystem
        </h1>
        <p className="mb-8 text-sm text-[var(--text2)] sm:mb-12 sm:text-base md:text-lg">
          Discover events, join clubs, and connect with your campus community. <br className="hidden sm:block" />
          <em className="not-italic text-[var(--accent3)]" style={{ fontFamily: "var(--font-jetbrains)" }}>
            Built for students, powered by AI.
          </em>
        </p>

        {/* Role cards */}
        <div className="grid w-full max-w-[720px] grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <RoleCard
            href="/login?role=student"
            icon={<GraduationCap size={22} />}
            title="Student"
            description="Browse events, join clubs, and build your campus profile."
            glow="rgba(99,102,241,.15)"
            border="rgba(99,102,241,.4)"
            shadow="0 0 30px rgba(99,102,241,.2)"
            delay="0.1s"
          />
          <RoleCard
            href="/login?role=clublead"
            icon={<Sparkles size={22} />}
            title="Club Lead"
            description="Manage your club, create events, and collaborate with others."
            glow="rgba(16,185,129,.15)"
            border="rgba(16,185,129,.4)"
            shadow="0 0 30px rgba(16,185,129,.2)"
            delay="0.2s"
          />
          <RoleCard
            href="/login?role=admin"
            icon={<ShieldCheck size={22} />}
            title="Admin"
            description="Oversee campus activities, approve events, and manage users."
            glow="rgba(239,68,68,.15)"
            border="rgba(239,68,68,.4)"
            shadow="0 0 30px rgba(239,68,68,.2)"
            delay="0.3s"
          />
        </div>
      </div>
    </div>
  );
}

function RoleCard({
  href,
  icon,
  title,
  description,
  glow,
  border,
  shadow,
  delay,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  glow: string;
  border: string;
  shadow: string;
  delay: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center rounded-[24px] border border-[var(--border2)] p-7 text-center text-[var(--text)] transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02))",
        animation: `scaleIn .5s ease both ${delay}`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = border;
        el.style.boxShadow = `0 20px 60px rgba(0,0,0,.5), ${shadow}`;
        el.style.setProperty("--rc-glow", glow);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "";
        el.style.boxShadow = "";
      }}
    >
      <div
        className="absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 0%,${glow} 0%,transparent 60%)`,
        }}
      />
      <div className="relative z-10 mb-3 flex h-[48px] w-[48px] items-center justify-center rounded-full sm:h-[52px] sm:w-[52px]"
        style={{ background: glow.replace(".15", ".3").replace(".2", ".2") }}
      >
        {icon}
      </div>
      <div className="relative z-10 text-[14px] font-bold sm:text-[15px]" style={{ fontFamily: "var(--font-syne)" }}>
        {title}
      </div>
      <div className="relative z-10 mt-1 text-[11px] text-[var(--text2)] sm:mt-1.5 sm:text-xs">{description}</div>
      <div className="relative z-10 mt-3 text-lg text-[var(--text3)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--text)]">
        &rarr;
      </div>
    </Link>
  );
}
