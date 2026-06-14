"use client";

import Link from "next/link";
import { ArrowRight, Bot, CalendarDays, ShieldCheck, Sparkles, Users2 } from "lucide-react";

const roles = [
  {
    href: "/login?role=student",
    title: "Student portal",
    description: "Discover events, track achievements, and build your campus profile.",
    icon: <CalendarDays className="h-5 w-5" />,
  },
  {
    href: "/login?role=clublead",
    title: "Club lead portal",
    description: "Create events, manage participation, and grow your campus community.",
    icon: <Users2 className="h-5 w-5" />,
  },
  {
    href: "/login?role=admin",
    title: "Admin portal",
    description: "Review activity, oversee operations, and guide the ecosystem at scale.",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--outline-variant)] bg-[rgba(255,255,255,0.72)] px-4 py-2 text-sm font-medium text-[var(--primary)] backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Intelligent campus ecosystem
            </div>
            <div className="space-y-5">
              <h1 className="ui-page-title max-w-4xl">
                Transform how students, clubs, and admins move through campus life.
              </h1>
              <p className="ui-page-copy max-w-2xl">
                CollegiaX unifies event discovery, club operations, participation records, calendars, and AI guidance into one calm, high-trust workspace designed for modern campus communities.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login?role=student" className="ui-button ui-button-primary">
                Enter CollegiaX
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/signup?role=student" className="ui-button ui-button-secondary">
                Create an account
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Campus events", value: "Unified discovery and scheduling" },
                { label: "Club operations", value: "Workflows for leads and organizers" },
                { label: "AI guidance", value: "Built-in assistant for recommendations" },
              ].map((item) => (
                <div key={item.label} className="ui-card p-5">
                  <p className="text-sm font-semibold text-[var(--on-background)]">{item.label}</p>
                  <p className="mt-2 text-sm text-[var(--on-surface-variant)]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ui-card overflow-hidden p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="ui-eyebrow">Choose your entry</p>
                <h2 className="font-heading text-3xl font-semibold text-[var(--on-background)]">Role-based access</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:rgba(42,96,137,0.12)] text-[var(--primary)]">
                <Bot className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-4">
              {roles.map((role) => (
                <Link
                  key={role.href}
                  href={role.href}
                  className="group flex items-center gap-4 rounded-[1.25rem] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] px-5 py-5 transition hover:border-[var(--primary)] hover:bg-[color:rgba(42,96,137,0.05)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-container-low)] text-[var(--primary)]">
                    {role.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-xl font-semibold text-[var(--on-background)]">{role.title}</p>
                    <p className="mt-1 text-sm text-[var(--on-surface-variant)]">{role.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[var(--on-surface-variant)] transition group-hover:translate-x-1 group-hover:text-[var(--primary)]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
