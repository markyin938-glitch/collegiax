export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-stretch">
      {/* Visual side */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden md:flex">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(.25)",
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(5,8,16,.6),rgba(99,102,241,.2))" }} />
        <div className="relative z-[2] max-w-[360px] text-center text-white">
          <h2 className="mb-3 text-[28px] font-extrabold" style={{ fontFamily: "var(--font-syne)" }}>
            Welcome to CollegiaX
          </h2>
          <p className="mb-7 text-sm text-white/60">
            The intelligent campus ecosystem for events, clubs, and community.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[10px] border border-white/10 bg-white/5 p-4">
              <div className="text-[22px] font-bold text-[var(--accent)]" style={{ fontFamily: "var(--font-syne)" }}>
                50+
              </div>
              <div className="mt-1 text-[11px] text-white/50">Active Clubs</div>
            </div>
            <div className="rounded-[10px] border border-white/10 bg-white/5 p-4">
              <div className="text-[22px] font-bold text-[var(--accent)]" style={{ fontFamily: "var(--font-syne)" }}>
                200+
              </div>
              <div className="mt-1 text-[11px] text-white/50">Events per Year</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex w-full flex-col items-center justify-center border-l border-[var(--border)] bg-[var(--bg2)] px-4 py-8 sm:px-6 sm:py-12 md:w-[440px] md:px-9">
        {children}
      </div>
    </div>
  );
}
