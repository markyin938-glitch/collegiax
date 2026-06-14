import Link from "next/link";
import { ArrowRight, CalendarDays, Sparkles, Users2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ui-auth-shell grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="ui-auth-hero relative hidden overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(170,218,255,0.22),transparent_30%)]" />
        <div className="relative z-10 flex w-full flex-col justify-between p-10 text-white xl:p-14">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 text-white backdrop-blur">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-heading text-2xl font-bold">CollegiaX</span>
            </Link>
          </div>
          <div className="max-w-xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Campus operating system</p>
            <h2 className="font-heading text-5xl font-semibold leading-tight">
              A calmer, smarter way to navigate campus life.
            </h2>
            <p className="max-w-lg text-base leading-7 text-white/78">
              Designed for students, club leaders, and administrators to coordinate events, participation, collaboration, and community in one intelligent workspace.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Events", icon: <CalendarDays className="h-5 w-5" />, value: "Discover and manage" },
                { label: "Clubs", icon: <Users2 className="h-5 w-5" />, value: "Build stronger communities" },
                { label: "Guidance", icon: <ArrowRight className="h-5 w-5" />, value: "Get AI-backed help" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.25rem] border border-white/14 bg-white/8 p-5 backdrop-blur">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/12">
                    {item.icon}
                  </div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="mt-2 text-sm text-white/70">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-xl">{children}</div>
      </div>
    </div>
  );
}
