import Link from "next/link";
import { Button, StatCard } from "@communityos/ui";
import { DonutChart, HorizontalBars, VerticalBarChart } from "@/components/charts";
import { HomeMapPreview } from "@/components/home-map-preview";
import {
  fetchCommunityStats,
  fetchEvents,
  fetchFeatures,
  fetchGeoAreas,
  fetchOpportunities,
  fetchPeopleStats,
  fetchSociety,
} from "@/lib/api";

export const dynamic = "force-dynamic";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function HomePage() {
  let society;
  let sectors;
  let features;
  let people;
  let life;
  let events;
  let opportunities;

  try {
    [
      { data: society },
      { data: sectors },
      { data: features },
      { data: people },
      { data: life },
      { data: events },
      { data: opportunities },
    ] = await Promise.all([
      fetchSociety(),
      fetchGeoAreas(undefined, "sector"),
      fetchFeatures(),
      fetchPeopleStats(),
      fetchCommunityStats(),
      fetchEvents(),
      fetchOpportunities(undefined, { status: "open" }),
    ]);
  } catch {
    return (
      <div className="cos-card p-8">
        <h1 className="font-display text-3xl text-ink">API offline</h1>
        <p className="mt-3 text-sm text-[color-mix(in_oklab,var(--cos-ink)_70%,transparent)]">
          Start the API (`pnpm --filter @communityos/api dev` or `pnpm dev`) so society data can
          load. Default endpoint: http://localhost:4000
        </p>
      </div>
    );
  }

  const sectorChart = sectors.map((sector) => ({
    label: sector.name.replace(/^Sector\s+/i, "S"),
    value: sector.residentEstimate,
  }));

  const pulseChart = [
    { label: "Mentors", value: people.mentors, color: "#0d9488" },
    { label: "Hiring", value: people.hiring, color: "#f59e0b" },
    { label: "Open to work", value: people.lookingForWork, color: "#06b6d4" },
    { label: "Connections", value: life.connections, color: "#10b981" },
  ];

  const engagementChart = [
    { label: "Feed posts", value: life.posts, color: "#0ea5e9" },
    { label: "Events", value: life.upcomingEvents, color: "#f97316" },
    { label: "Opportunities", value: life.openOpportunities, color: "#10b981" },
    { label: "Households", value: people.households, color: "#0d9488" },
  ];

  const opportunityKinds = Object.entries(
    opportunities.reduce(
      (acc, row) => {
        acc[row.kind] = (acc[row.kind] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).map(([label, value]) => ({
    label: label.replaceAll("_", " "),
    value,
  }));

  const eventRsvp = events.slice(0, 5).map((event) => ({
    label: event.title.length > 22 ? `${event.title.slice(0, 20)}…` : event.title,
    value: event.goingCount + event.interestedCount,
  }));

  return (
    <div className="space-y-8">
      <section className="cos-fade-up relative overflow-hidden rounded-[1.75rem] border border-white/50 bg-[linear-gradient(135deg,#042f2e_0%,#0f766e_38%,#06b6d4_72%,#f97316_125%)] p-6 text-white shadow-[0_20px_60px_rgba(15,118,110,0.28)] md:p-9">
        <div className="pointer-events-none absolute -left-10 top-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22),transparent_70%)]" />
        <div className="pointer-events-none absolute -right-8 -top-12 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.35),transparent_68%)]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-64 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.35),transparent_70%)] blur-2xl" />
        <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
          {greeting()}, Administrator
        </p>
        <h1 className="relative mt-3 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
          {society.name}
        </h1>
        <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-white/85">
          {society.settings.branding.tagline ||
            "A living Community Graph across people, places, professions, and opportunity."}
        </p>
        <div className="relative mt-7 flex flex-wrap gap-3">
          <Link href="/map">
            <Button className="!bg-white !text-teal-900 !shadow-lg">Open Society Map</Button>
          </Link>
          <Link href="/admin">
            <Button variant="secondary" className="!bg-white/15 !text-white !ring-white/30">
              Admin console
            </Button>
          </Link>
          <Link href="/analytics">
            <Button variant="secondary" className="!bg-white/15 !text-white !ring-white/30">
              Full analytics
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/residents" className="cos-fade-up block transition hover:-translate-y-1" style={{ animationDelay: "40ms" }}>
          <StatCard
            tone="teal"
            label="Residents"
            value={people.residents.toLocaleString()}
            hint="Active community members"
          />
        </Link>
        <Link href="/events" className="cos-fade-up block transition hover:-translate-y-1" style={{ animationDelay: "90ms" }}>
          <StatCard
            tone="coral"
            label="Upcoming events"
            value={life.upcomingEvents.toLocaleString()}
            hint="Camps, clinics & meetups"
          />
        </Link>
        <Link href="/opportunities" className="cos-fade-up block transition hover:-translate-y-1" style={{ animationDelay: "140ms" }}>
          <StatCard
            tone="emerald"
            label="Open opportunities"
            value={life.openOpportunities.toLocaleString()}
            hint="Jobs · mentorship · volunteer"
          />
        </Link>
        <Link href="/map" className="cos-fade-up block transition hover:-translate-y-1" style={{ animationDelay: "190ms" }}>
          <StatCard
            tone="sky"
            label="Amenities"
            value={String(society.stats.amenities)}
            hint="Mapped community facilities"
          />
        </Link>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <div className="cos-card cos-card-glow cos-fade-up p-5 md:p-6 xl:col-span-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h2 className="font-display text-2xl text-ink">Sector population</h2>
            <span className="cos-pill bg-[linear-gradient(135deg,#ccfbf1,#cffafe)] text-teal-800">
              Live
            </span>
          </div>
          <p className="mb-4 text-sm text-[color-mix(in_oklab,var(--cos-ink)_60%,transparent)]">
            Resident estimates by sector for a quick geographic glance.
          </p>
          <VerticalBarChart data={sectorChart} />
        </div>

        <div className="cos-card cos-card-glow cos-fade-up p-5 md:p-6" style={{ animationDelay: "80ms" }}>
          <h2 className="font-display text-2xl text-ink">Talent pulse</h2>
          <p className="mt-1 mb-4 text-sm text-[color-mix(in_oklab,var(--cos-ink)_60%,transparent)]">
            Mentors, hiring, and work-seeking signals.
          </p>
          <DonutChart
            data={pulseChart}
            centerLabel="signals"
            centerValue={String(
              people.mentors + people.hiring + people.lookingForWork + life.connections,
            )}
          />
        </div>

        <div className="cos-card cos-card-glow cos-fade-up p-5 md:p-6" style={{ animationDelay: "120ms" }}>
          <h2 className="font-display text-2xl text-ink">Engagement mix</h2>
          <p className="mt-1 mb-4 text-sm text-[color-mix(in_oklab,var(--cos-ink)_60%,transparent)]">
            Posts, events, opportunities, and households at a glance.
          </p>
          <HorizontalBars data={engagementChart} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="cos-card cos-card-glow overflow-hidden p-5 md:p-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-ink">Society Map</h2>
              <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cos-ink)_60%,transparent)]">
                Interactive geography with amenities and properties.
              </p>
            </div>
            <Link href="/map" className="text-sm font-semibold text-teal">
              Full map →
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl ring-1 ring-teal-500/15">
            <HomeMapPreview />
          </div>
        </div>

        <div className="space-y-5">
          <div className="cos-card cos-card-glow p-5 md:p-6">
            <h2 className="font-display text-2xl text-ink">Opportunity kinds</h2>
            <p className="mt-1 mb-4 text-sm text-[color-mix(in_oklab,var(--cos-ink)_60%,transparent)]">
              Open roles grouped by type.
            </p>
            {opportunityKinds.length ? (
              <DonutChart data={opportunityKinds} centerLabel="open" size={160} />
            ) : (
              <p className="text-sm text-[var(--cos-ink)]/50">No open opportunities yet.</p>
            )}
          </div>

          <div className="cos-card p-5 md:p-6 bg-[linear-gradient(160deg,#fff7ed_0%,#ffffff_45%,#ecfeff_100%)]">
            <h2 className="font-display text-2xl text-ink">Event interest</h2>
            <p className="mt-1 mb-4 text-sm text-[color-mix(in_oklab,var(--cos-ink)_60%,transparent)]">
              Going + interested RSVPs for upcoming events.
            </p>
            {eventRsvp.length ? (
              <HorizontalBars data={eventRsvp} />
            ) : (
              <p className="text-sm text-[var(--cos-ink)]/50">No upcoming events.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="cos-card p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink">Sector pulse</h2>
            <Link href="/geography" className="text-sm font-semibold text-teal">
              Geography →
            </Link>
          </div>
          <ul className="space-y-3">
            {sectors.map((sector, index) => (
              <li
                key={sector.id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-[linear-gradient(90deg,rgba(13,148,136,0.08),rgba(6,182,212,0.05))] px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{sector.name}</p>
                  <p className="text-xs text-[color-mix(in_oklab,var(--cos-ink)_55%,transparent)]">
                    {sector.householdEstimate} households
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl text-ink">
                    {sector.residentEstimate.toLocaleString()}
                  </p>
                  <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-white/80">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (sector.residentEstimate / 2000) * 100)}%`,
                        background: `linear-gradient(90deg, ${["#0d9488", "#06b6d4", "#10b981", "#f59e0b", "#f97316"][index % 5]}, #67e8f9)`,
                      }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="cos-card p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl text-ink">Facilities</h2>
            <Link href="/map" className="text-sm font-semibold text-teal">
              On map →
            </Link>
          </div>
          <ul className="space-y-2">
            {features.slice(0, 6).map((feature) => (
              <li
                key={feature.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-teal-500/10 bg-gradient-to-r from-white to-cyan-50/60 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{feature.name}</p>
                  <p className="text-xs text-[color-mix(in_oklab,var(--cos-ink)_55%,transparent)]">
                    {feature.description}
                  </p>
                </div>
                <span className="cos-pill bg-[linear-gradient(135deg,#ccfbf1,#fff7ed)] text-teal-800">
                  {feature.featureType.replaceAll("_", " ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
