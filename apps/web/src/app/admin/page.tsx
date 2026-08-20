"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchBusinesses,
  fetchCommunityStats,
  fetchPeopleStats,
  fetchSociety,
  type SocietyDetail,
} from "@/lib/api";

type AdminStats = {
  society: SocietyDetail;
  businessCount: number;
  people: {
    residents: number;
    households: number;
    mentors: number;
    hiring: number;
    lookingForWork: number;
    source: string;
  };
  life: {
    connections: number;
    posts: number;
    upcomingEvents: number;
    openOpportunities: number;
    source: string;
  };
};

const manageGroups = [
  {
    title: "Society & geography",
    description: "Boundaries, hierarchy, properties, and map intelligence.",
    items: [
      {
        href: "/geography",
        label: "Geography levels",
        action: "Review phases, sectors, and blocks",
      },
      {
        href: "/properties",
        label: "Property register",
        action: "Manage occupancy and property status",
      },
      {
        href: "/map",
        label: "Society Map",
        action: "Inspect layers, amenities, and area intelligence",
      },
    ],
  },
  {
    title: "People & households",
    description: "Residents, privacy-sensitive profiles, and occupancy links.",
    items: [
      {
        href: "/residents",
        label: "Residents",
        action: "Browse profiles, mentors, and hiring signals",
      },
      {
        href: "/households",
        label: "Households",
        action: "Review household membership and property links",
      },
      {
        href: "/professionals",
        label: "Professional directory",
        action: "Filter by category, skill, and mentoring",
      },
    ],
  },
  {
    title: "Local economy",
    description: "Resident-owned businesses, verification, and hiring.",
    items: [
      {
        href: "/businesses",
        label: "Business directory",
        action: "Review listings, owners, and services",
      },
      {
        href: "/opportunities",
        label: "Opportunities hub",
        action: "Jobs, freelance, mentorship, and volunteer roles",
      },
    ],
  },
  {
    title: "Community engagement",
    description: "Connections, feed, and events across the society.",
    items: [
      {
        href: "/network",
        label: "Network",
        action: "Accepted and pending resident connections",
      },
      {
        href: "/feed",
        label: "Society feed",
        action: "Announcements, questions, and updates",
      },
      {
        href: "/events",
        label: "Events",
        action: "Upcoming gatherings and RSVP counts",
      },
    ],
  },
  {
    title: "Intelligence & oversight",
    description: "KPIs, privacy posture, and operational monitoring.",
    items: [
      {
        href: "/analytics",
        label: "Analytics dashboard",
        action: "Society-wide KPIs and drill-down links",
      },
      {
        href: "/admin#privacy",
        label: "Privacy & data rules",
        action: "Field visibility and minor-data protections",
      },
      {
        href: "/admin#platform",
        label: "Platform settings",
        action: "Branding, heatmap thresholds, and data source",
      },
    ],
  },
];

export default function AdminPage() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchSociety(), fetchPeopleStats(), fetchCommunityStats(), fetchBusinesses()])
      .then(([societyRes, peopleRes, lifeRes, businessRes]) => {
        setData({
          society: societyRes.data,
          businessCount: businessRes.data.length,
          people: peopleRes.data,
          life: lifeRes.data,
        });
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="cos-card space-y-3 p-8">
        <h1 className="font-display text-3xl text-ink">Admin unavailable</h1>
        <p className="text-sm text-[var(--cos-danger)]">{error}</p>
        <p className="text-sm text-[color-mix(in_oklab,var(--cos-ink)_70%,transparent)]">
          Confirm the API is running, then refresh this page.
        </p>
      </div>
    );
  }

  if (!data) {
    return <div className="cos-card p-8 text-[var(--cos-ink)]/50">Loading admin console…</div>;
  }

  const { society, people, life, businessCount } = data;
  const dataSource = society.source === "supabase" ? "Live database" : "Configured dataset";

  return (
    <div className="space-y-8">
      <header className="cos-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">
          Society administration
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-ink md:text-4xl">
          {society.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
          Control center for geography, people, businesses, engagement, privacy, and community
          intelligence.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="cos-pill bg-[var(--cos-sand)] text-ink">Data: {dataSource}</span>
          <span className="cos-pill bg-[var(--cos-sand)] text-ink">Timezone: {society.timezone}</span>
          <span className="cos-pill bg-[var(--cos-sand)] text-ink">
            Heatmap min: {society.settings.heatmapMinBucketSize}
          </span>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Residents", value: people.residents, href: "/residents" },
          { label: "Households", value: people.households, href: "/households" },
          { label: "Properties", value: society.stats.properties, href: "/properties" },
          { label: "Businesses", value: businessCount, href: "/businesses" },
          { label: "Connections", value: life.connections, href: "/network" },
          { label: "Feed posts", value: life.posts, href: "/feed" },
          { label: "Upcoming events", value: life.upcomingEvents, href: "/events" },
          { label: "Open opportunities", value: life.openOpportunities, href: "/opportunities" },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="cos-card block p-5 transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cos-ink)]/50">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl text-ink">{card.value.toLocaleString()}</p>
            <p className="mt-2 text-xs font-semibold text-teal">Manage →</p>
          </Link>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-3xl text-ink">Manage the platform</h2>
          <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
            Every operational area of CommunityOS for this society.
          </p>
        </div>
        <div className="space-y-5">
          {manageGroups.map((group) => (
            <div key={group.title} className="cos-card p-5 md:p-6">
              <h3 className="font-display text-2xl text-ink">{group.title}</h3>
              <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cos-ink)_65%,transparent)]">
                {group.description}
              </p>
              <ul className="mt-4 divide-y divide-[var(--cos-border)]">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 transition hover:bg-[var(--cos-sand)]/40"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink">{item.label}</p>
                        <p className="text-xs text-[var(--cos-ink)]/55">{item.action}</p>
                      </div>
                      <span className="text-sm font-semibold text-teal">Open →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="privacy" className="grid gap-4 lg:grid-cols-2">
        <article className="cos-card p-5 md:p-6">
          <h2 className="font-display text-2xl text-ink">Privacy & data rules</h2>
          <ul className="mt-4 space-y-3 text-sm text-[color-mix(in_oklab,var(--cos-ink)_75%,transparent)]">
            <li>
              <strong className="text-ink">Field visibility</strong> — phone, email, address, and
              profession fields follow resident privacy settings.
            </li>
            <li>
              <strong className="text-ink">Minors / dependents</strong> — private by default; excluded
              from directories, search, and map discovery.
            </li>
            <li>
              <strong className="text-ink">Map precision</strong> — exact household coordinates stay
              admin-restricted; public views use degraded precision.
            </li>
            <li>
              <strong className="text-ink">Heatmaps</strong> — aggregates suppress buckets below{" "}
              {society.settings.heatmapMinBucketSize} households.
            </li>
            <li>
              <strong className="text-ink">Sensitive exports</strong> — require elevated permission and
              audit logging before release.
            </li>
          </ul>
        </article>

        <article id="platform" className="cos-card p-5 md:p-6">
          <h2 className="font-display text-2xl text-ink">Platform settings</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3 border-b border-[var(--cos-border)] py-2">
              <dt className="text-[var(--cos-ink)]/55">Society name</dt>
              <dd className="font-semibold text-ink">{society.name}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-[var(--cos-border)] py-2">
              <dt className="text-[var(--cos-ink)]/55">Slug</dt>
              <dd className="font-semibold text-ink">{society.slug}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-[var(--cos-border)] py-2">
              <dt className="text-[var(--cos-ink)]/55">Primary label</dt>
              <dd className="font-semibold text-ink">
                {society.settings.branding.primaryLabel}
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-[var(--cos-border)] py-2">
              <dt className="text-[var(--cos-ink)]/55">Tagline</dt>
              <dd className="max-w-[60%] text-right font-semibold text-ink">
                {society.settings.branding.tagline || "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-[var(--cos-border)] py-2">
              <dt className="text-[var(--cos-ink)]/55">Data source</dt>
              <dd className="font-semibold text-ink">{dataSource}</dd>
            </div>
            <div className="flex justify-between gap-3 py-2">
              <dt className="text-[var(--cos-ink)]/55">People data source</dt>
              <dd className="font-semibold capitalize text-ink">{people.source}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="cos-card p-5 md:p-6">
          <h2 className="font-display text-2xl text-ink">Roles & access</h2>
          <p className="mt-2 text-sm text-[color-mix(in_oklab,var(--cos-ink)_70%,transparent)]">
            Authorization is permission-based (not role display names alone). Typical society
            admin capabilities:
          </p>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {[
              "residents.read / manage",
              "households.manage",
              "sensitive_resident_data.read",
              "map.admin_view",
              "businesses.verify",
              "events.manage",
              "opportunities.manage",
              "exports.create",
              "analytics.sensitive_read",
              "moderation.act",
            ].map((perm) => (
              <li
                key={perm}
                className="rounded-xl bg-[var(--cos-sand)]/70 px-3 py-2 font-medium text-ink"
              >
                {perm}
              </li>
            ))}
          </ul>
        </article>

        <article className="cos-card p-5 md:p-6">
          <h2 className="font-display text-2xl text-ink">Moderation & safety</h2>
          <ul className="mt-4 space-y-3">
            {[
              {
                href: "/feed",
                title: "Review feed content",
                body: "Scan announcements and questions for policy issues.",
              },
              {
                href: "/network",
                title: "Connection requests",
                body: "Monitor pending relationship requests.",
              },
              {
                href: "/businesses",
                title: "Business verification",
                body: "Check unverified or pending listings.",
              },
              {
                href: "/analytics",
                title: "Community health",
                body: "Watch engagement and opportunity coverage.",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl bg-[var(--cos-sand)]/60 px-3 py-3 transition hover:bg-white"
                >
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="text-xs text-[var(--cos-ink)]/55">{item.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="cos-card p-5 md:p-6">
        <h2 className="font-display text-2xl text-ink">Data operations</h2>
        <p className="mt-2 max-w-3xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_70%,transparent)]">
          Schema and seed scripts live under{" "}
          <code className="rounded bg-[var(--cos-sand)] px-1.5 py-0.5 text-xs">
            packages/database/prisma/manual
          </code>
          . Apply them in Supabase SQL Editor when provisioning or refreshing society data.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Core schema", body: "bootstrap.sql" },
            { title: "Geography seed", body: "seed-jaffar-e-tayyar.sql" },
            { title: "People schema + seed", body: "m2-m3-bootstrap + residents seed" },
            { title: "Businesses", body: "m4-bootstrap + businesses seed" },
            { title: "Community life", body: "m5-m9-bootstrap + community-life seed" },
            { title: "Setup guide", body: "docs/SUPABASE_SETUP.md" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-[var(--cos-border)] bg-white/70 p-4">
              <p className="text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-xs text-[var(--cos-ink)]/55">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
