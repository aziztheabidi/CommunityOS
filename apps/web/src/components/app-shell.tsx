"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryNav = [
  { href: "/", label: "Home", group: "general" },
  { href: "/map", label: "Society Map", group: "general" },
  { href: "/properties", label: "Properties", group: "general" },
  { href: "/geography", label: "Geography", group: "general" },
  { href: "/residents", label: "Residents", group: "general" },
  { href: "/households", label: "Households", group: "general" },
  { href: "/professionals", label: "Professionals", group: "general" },
  { href: "/businesses", label: "Businesses", group: "general" },
  { href: "/network", label: "Network", group: "general" },
  { href: "/feed", label: "Feed", group: "general" },
  { href: "/events", label: "Events", group: "general" },
  { href: "/opportunities", label: "Opportunities", group: "general" },
  { href: "/analytics", label: "Analytics", group: "general" },
  { href: "/admin", label: "Admin", group: "admin" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(165deg,#0b1f24_0%,#12353a_48%,#0f6b6b_140%)] px-4 py-5 text-white lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="pointer-events-none absolute -left-10 top-24 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(216,239,239,0.22),transparent_70%)]" />
        <div className="relative px-2">
          <p className="font-display text-2xl tracking-tight">CommunityOS</p>
          <p className="mt-1 text-xs text-white/65">Society Intelligence Platform</p>
          <div className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-xs backdrop-blur">
            <p className="font-semibold text-white/90">Jaffar-e-Tayyar Society</p>
            <p className="text-white/55">Demo · Milestone 5–9</p>
          </div>
        </div>
        <nav className="relative mt-6 space-y-1" aria-label="Primary">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.soon ? "#" : item.href}
                aria-disabled={item.soon}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white text-[var(--cos-ink)] shadow-lg shadow-black/10"
                    : item.soon
                      ? "cursor-default text-white/35"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {item.soon ? <span className="text-[10px] uppercase tracking-wide">Soon</span> : null}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[var(--cos-border)] bg-[color-mix(in_oklab,var(--cos-surface)_82%,transparent)] px-4 py-3 backdrop-blur-xl md:px-6">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[var(--cos-border)] bg-white/75 px-3 py-2.5 shadow-sm">
            <span className="sr-only">Global search</span>
            <span aria-hidden className="text-sm text-teal">
              ⌕
            </span>
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-[color-mix(in_oklab,var(--cos-ink)_45%,transparent)]"
              placeholder="Search sectors, properties, amenities…"
              type="search"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden rounded-xl border border-[var(--cos-border)] bg-white/80 px-3 py-2 text-xs font-semibold sm:inline-flex"
            >
              ⌘K
            </button>
            <button
              type="button"
              className="rounded-xl border border-[var(--cos-border)] bg-white/80 px-3 py-2 text-xs font-semibold"
            >
              Alerts
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cos-teal)] text-xs font-bold text-white">
              GV
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
