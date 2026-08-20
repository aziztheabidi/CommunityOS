"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchCommunityStats,
  fetchPeopleStats,
  fetchSociety,
  type SocietyDetail,
} from "@/lib/api";

export default function AnalyticsPage() {
  const [society, setSociety] = useState<SocietyDetail | null>(null);
  const [people, setPeople] = useState<{
    residents: number;
    households: number;
    mentors: number;
    hiring: number;
    lookingForWork: number;
  } | null>(null);
  const [life, setLife] = useState<{
    connections: number;
    posts: number;
    upcomingEvents: number;
    openOpportunities: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchSociety(), fetchPeopleStats(), fetchCommunityStats()])
      .then(([societyRes, peopleRes, lifeRes]) => {
        setSociety(societyRes.data);
        setPeople(peopleRes.data);
        setLife(lifeRes.data);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <div className="cos-card p-8 text-[var(--cos-danger)]">{error}</div>;
  }

  if (!society || !people || !life) {
    return <div className="cos-card p-8 text-[var(--cos-ink)]/50">Loading analytics…</div>;
  }

  const cards = [
    { label: "Residents", value: people.residents, href: "/residents" },
    { label: "Households", value: people.households, href: "/households" },
    { label: "Mentors", value: people.mentors, href: "/professionals" },
    { label: "Hiring residents", value: people.hiring, href: "/professionals" },
    { label: "Looking for work", value: people.lookingForWork, href: "/opportunities" },
    { label: "Connections", value: life.connections, href: "/network" },
    { label: "Feed posts", value: life.posts, href: "/feed" },
    { label: "Upcoming events", value: life.upcomingEvents, href: "/events" },
    { label: "Open opportunities", value: life.openOpportunities, href: "/opportunities" },
    { label: "Properties", value: society.stats.properties, href: "/properties" },
    { label: "Amenities", value: society.stats.amenities, href: "/map" },
    { label: "Sectors", value: society.stats.sectors, href: "/geography" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">Analytics</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Community intelligence</h1>
        <p className="mt-2 max-w-2xl text-sm text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
          Snapshot KPIs across geography, people, economy, and engagement for {society.name}.
          Snapshot history and heatmaps deepen in later hardening.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="cos-card block p-5 transition hover:-translate-y-0.5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--cos-ink)]/50">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl text-ink">{card.value.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
