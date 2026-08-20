import Link from "next/link";

const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/#residents", label: "Residents" },
  { href: "/#map", label: "Map" },
  { href: "/#professionals", label: "Professionals" },
  { href: "/#businesses", label: "Businesses" },
  { href: "/#network", label: "Network" },
  { href: "/#feed", label: "Feed" },
  { href: "/#events", label: "Events" },
  { href: "/#opportunities", label: "Opportunities" },
  { href: "/#groups", label: "Groups" },
  { href: "/#messages", label: "Messages" },
  { href: "/#analytics", label: "Analytics" },
  { href: "/#admin", label: "Admin" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16.5rem_1fr]">
      <aside className="border-b border-[var(--cos-border)] bg-[color-mix(in_oklab,var(--cos-surface)_88%,white)] px-4 py-5 lg:border-b-0 lg:border-r">
        <div className="px-2">
          <p className="font-display text-2xl tracking-tight text-ink">CommunityOS</p>
          <p className="mt-1 text-xs text-[color-mix(in_oklab,var(--cos-ink)_60%,transparent)]">
            Society Intelligence Platform
          </p>
        </div>
        <nav className="mt-6 space-y-1" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block rounded-xl px-3 py-2 text-sm font-medium text-ink transition hover:bg-[var(--cos-teal-soft)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[var(--cos-border)] bg-[color-mix(in_oklab,var(--cos-surface)_90%,transparent)] px-4 py-3 backdrop-blur md:px-6">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[var(--cos-border)] bg-white/70 px-3 py-2">
            <span className="sr-only">Global search</span>
            <span aria-hidden className="text-sm text-teal">
              ⌕
            </span>
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-[color-mix(in_oklab,var(--cos-ink)_45%,transparent)]"
              placeholder="Search people, skills, businesses, places…"
              type="search"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-[var(--cos-border)] bg-white/70 px-3 py-2 text-xs font-semibold"
            >
              ⌘K
            </button>
            <button
              type="button"
              className="rounded-xl border border-[var(--cos-border)] bg-white/70 px-3 py-2 text-xs font-semibold"
            >
              Alerts
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
