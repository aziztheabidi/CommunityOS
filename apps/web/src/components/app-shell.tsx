"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Society Map" },
  { href: "/properties", label: "Properties" },
  { href: "/geography", label: "Geography" },
  { href: "/residents", label: "Residents" },
  { href: "/households", label: "Households" },
  { href: "/professionals", label: "Professionals" },
  { href: "/businesses", label: "Businesses" },
  { href: "/network", label: "Network" },
  { href: "/feed", label: "Feed" },
  { href: "/events", label: "Events" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/analytics", label: "Analytics" },
  { href: "/admin", label: "Admin" },
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
            <p className="text-white/55">Administrator workspace</p>
          </div>
        </div>
        <nav className="relative mt-6 space-y-1" aria-label="Primary">
          {primaryNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white text-[var(--cos-ink)] shadow-lg shadow-black/10"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
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
              placeholder="Search residents, properties, businesses, events…"
              type="search"
            />
          </label>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden rounded-xl border border-[var(--cos-border)] bg-white/80 px-3 py-2 text-xs font-semibold sm:inline-flex"
            >
              Admin
            </Link>
            <Link
              href="/feed"
              className="rounded-xl border border-[var(--cos-border)] bg-white/80 px-3 py-2 text-xs font-semibold"
            >
              Alerts
            </Link>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cos-teal)] text-xs font-bold text-white"
              title="Administrator"
            >
              AD
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
