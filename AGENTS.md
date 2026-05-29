# CollegiaX — Agent Guide

## Project Overview
Full-stack campus ecosystem built with Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Drizzle ORM, and better-sqlite3 (local) / Turso (production).

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: SQLite via `better-sqlite3` (local dev) / Turso (production)
- **ORM**: Drizzle ORM
- **Auth**: Custom JWT (jose) + bcryptjs + httpOnly cookies
- **State**: Zustand (client UI state), TanStack Query (server state)
- **Forms**: React Hook Form + Zod
- **Charts**: Chart.js + react-chartjs-2
- **Email**: Resend
- **AI**: Anthropic Claude API (server-side only)

## Project Structure
```
collegiax/
├── app/
│   ├── (auth)/          # Auth pages (login, signup, verify-email, forgot-password, reset-password)
│   ├── (app)/           # Authenticated portal with sidebar+topbar shell
│   │   ├── dashboard/
│   │   ├── events/      # [id], create, manage
│   │   ├── clubs/       # [id], [id]/members
│   │   ├── calendar/
│   │   ├── saved/
│   │   ├── leaderboard/
│   │   ├── participation/
│   │   ├── profile/
│   │   ├── messages/
│   │   ├── assistant/
│   │   ├── collaboration/
│   │   ├── event-analysis/
│   │   └── admin/       # users, analytics, announcements
│   ├── api/             # Route handlers
│   │   └── auth/        # signup, login, logout, me, verify-email, resend-verification, forgot-password, reset-password
│   ├── page.tsx         # Landing page
│   └── layout.tsx       # Root layout with fonts
├── components/
│   ├── ui/              # shadcn/ui primitives
│   └── shell/           # Sidebar, Topbar, LogoutButton
├── lib/
│   ├── db/
│   │   ├── client.ts    # Drizzle + better-sqlite3
│   │   ├── schema.ts    # All table definitions
│   │   └── seed.ts      # Dev seed data
│   ├── auth/            # jwt.ts, password.ts, session.ts, permissions.ts
│   ├── validation/      # Zod schemas (auth.ts, events.ts, shared.ts)
│   └── utils.ts         # cn(), formatters, slugify, initials
├── stores/              # Zustand stores (theme-store.ts, ui-store.ts)
├── drizzle/             # Generated migrations
├── middleware.ts        # Auth gate + role redirects
└── drizzle.config.ts
```

## Database
Local development uses `better-sqlite3` with a file at `./local.db`.
Production uses Turso (libSQL) via `@libsql/client`.

### Running Migrations
```bash
npx drizzle-kit push
```

### Seeding
```bash
npx tsx scripts/seed.ts
```

Default seed accounts:
- `admin@collegiax.app` / `admin123` (Admin)
- `lead@collegiax.app` / `lead123` (Club Lead)
- `student@collegiax.app` / `student123` (Student)

## Auth
- Access token: JWT (HS256), 15 min, httpOnly cookie
- Refresh token: Opaque 256-bit string, 30 days, httpOnly cookie + hashed in DB
- Middleware protects `/(app)/**` and `/admin/**`
- Role-aware redirects after login

## Environment Variables
Copy `.env.example` to `.env.local` and fill in:
```
AUTH_SECRET=...
TURSO_DATABASE_URL=file:./local.db
TURSO_AUTH_TOKEN=
RESEND_API_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Scripts
```bash
npm run dev      # Start dev server
npm run build    # Production build
npx tsc --noEmit # Type check
npx drizzle-kit push # Push schema changes
```

## Design System
- CSS variables in `globals.css` ported from the HTML prototype
- Dark/light mode via `data-theme` attribute on `<html>`
- Glass cards: `.glass-card`
- Gradient mesh: `.grad-mesh`
- Fonts: Syne (heading), DM Sans (body), JetBrains Mono (mono)
- Role-specific accent colors via `body[data-role]`

## Key Notes
- All API routes export `dynamic = "force-dynamic"` to avoid static generation issues with DB imports.
- The `middleware.ts` file is currently used but Next.js 16 deprecates it in favor of `proxy.ts`. Keep as-is until migration guide is stable.
- `useSearchParams()` must be wrapped in `<Suspense>` for static pages.
