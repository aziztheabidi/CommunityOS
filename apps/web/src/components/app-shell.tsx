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
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-white/10 bg-[var(--cos-sidebar)] px-3 py-5 text-white lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="px-2">
          <p className="font-display text-xl tracking-tight">CommunityOS</p>
          <p className="mt-1 text-xs text-white/55">Society Intelligence</p>
          <div className="mt-4 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
            <p className="font-medium text-white/90">Jaffar-e-Tayyar Society</p>
            <p className="mt-0.5 text-white/45">Administrator</p>
          </div>
        </div>
        <nav className="mt-6 space-y-0.5" aria-label="Primary">
          {primaryNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white text-[var(--cos-ink)]"
                    : "text-white/70 hover:bg-white/8 hover:text-white"
                }`}
              >
                <span className={active ? "text-[var(--cos-ink)]" : undefined}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[var(--cos-border)] bg-[color-mix(in_oklab,var(--cos-surface)_90%,transparent)] px-4 py-3 backdrop-blur-md md:px-6">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--cos-border)] bg-white px-3 py-2">
            <span className="sr-only">Global search</span>
            <span aria-hidden className="text-sm text-teal">
              ⌕
            </span>
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-[color-mix(in_oklab,var(--cos-ink)_40%,transparent)]"
              placeholder="Search residents, properties, events…"
              type="search"
            />
          </label>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="hidden rounded-lg border border-[var(--cos-border)] bg-white px-3 py-2 text-xs font-semibold text-ink sm:inline-flex"
            >
              Admin
            </Link>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cos-teal)] text-[11px] font-bold text-white"
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
