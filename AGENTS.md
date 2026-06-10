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
See `design-system.md` for the full design system specification.

### Quick Reference
- **Brand**: Lumina Nexus — Modern Minimalist with Brutalist undertones
- **CSS variables**: Defined in `globals.css`
- **Dark/light mode**: Via `data-theme` attribute on `<html>`
- **Glass cards**: `.glass-card`
- **Gradient mesh**: `.grad-mesh`
- **Fonts**: Syne (heading), DM Sans (body), JetBrains Mono (mono)
- **Role-specific accents**: Via `body[data-role]`

### Colors
- **Primary**: Pure Black (#000000) for core branding and primary actions
- **Secondary**: Electric Cobalt (#5D5DFF) for links, active states, focus indicators
- **Tertiary**: Digital Cyan (#00F0FF) for data visualization and highlights
- **Surfaces**: Pure white (#FFFFFF) for work areas, off-white (#F8F9FA) for structural depth

### Typography
- **Display**: Syne, 72px, 800 weight, 1.1 line height, -0.02em tracking
- **Headline LG**: Syne, 48px desktop / 32px mobile, 700 weight
- **Headline MD**: Syne, 32px, 700 weight, 1.3 line height
- **Body LG**: DM Sans, 18px, 400 weight, 1.6 line height
- **Body MD**: DM Sans, 16px, 400 weight, 1.6 line height
- **Label**: DM Sans, 14px, 700 weight
- **Caption**: DM Sans, 12px, 500 weight

### Layout & Spacing
- **Base unit**: 4px
- **Grid**: 12-column fluid on desktop, 4-column on mobile
- **Container max**: 1440px
- **Margins**: 16px mobile, 48px desktop

### Elevation & Depth
- **Level 0 (Base)**: #F8F9FA background
- **Level 1 (Cards)**: #FFFFFF with 1px #E2E2E2 border
- **Level 2 (Popovers/Modals)**: #FFFFFF with 2px black border + 4px hard offset shadow
- **No blur shadows** — use tonal layering and sharp outlines

### Shapes
- **Sharp corners (0px border-radius)** for all containers, buttons, and inputs
- Reinforces technical "cyber" campus feel

### Component Patterns
- **Buttons**: Primary = solid black with white text; Secondary = white with 1px black border
- **Inputs**: Off-white background with bottom-only 2px black border
- **Cards**: White surfaces, no shadows, 1px borders, gray headers for metadata
- **Chips**: Rectangular tags with #E2E2E2 backgrounds, uppercase DM Sans bold

## Key Notes
- All API routes export `dynamic = "force-dynamic"` to avoid static generation issues with DB imports.
- The `middleware.ts` file is currently used but Next.js 16 deprecates it in favor of `proxy.ts`. Keep as-is until migration guide is stable.
- `useSearchParams()` must be wrapped in `<Suspense>` for static pages.

## Navigation
- The **CollegiaX branding** in the Sidebar header and Topbar acts as the dashboard button (links to `/dashboard`).
- There is **no "Dashboard" nav item** in the sidebar — users click the CollegiaX logo to return to the dashboard.
- Navigation items are defined in `lib/auth/permissions.ts` under `ROLE_NAVS`, scoped by role (student, clublead, admin).

## Responsive Design
- Mobile-first approach with Tailwind breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px).
- Sidebar slides in on mobile with overlay backdrop; collapses to icon-only on `md+` screens.
- Topbar shows CollegiaX logo + breadcrumb on `sm+`; hides logo on mobile to save space.
- Main content padding scales: `p-3` → `sm:p-4` → `md:p-5` → `lg:p-6`.
- Landing page uses smaller logo, headline, and role cards on mobile with proper breakpoints.
- Auth layout shows visual side panel only on `md+`; form side is full-width on mobile.
