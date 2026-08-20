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
    { label: "Mentors", value: people.mentors },
    { label: "Hiring", value: people.hiring },
    { label: "Open to work", value: people.lookingForWork },
    { label: "Connections", value: life.connections },
  ];

  const engagementChart = [
    { label: "Feed posts", value: life.posts },
    { label: "Events", value: life.upcomingEvents },
    { label: "Opportunities", value: life.openOpportunities },
    { label: "Households", value: people.households },
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
    <div className="space-y-6">
      <section className="cos-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">
          {greeting()}, Administrator
        </p>
        <h1 className="mt-2 max-w-3xl font-display text-3xl tracking-tight text-ink md:text-4xl">
          {society.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color-mix(in_oklab,var(--cos-ink)_68%,transparent)]">
          {society.settings.branding.tagline ||
            "People, places, professions, and opportunity in one Community Graph."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/map">
            <Button>Society Map</Button>
          </Link>
          <Link href="/admin">
            <Button variant="secondary">Admin</Button>
          </Link>
          <Link href="/analytics">
            <Button variant="ghost">Analytics</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/residents" className="block transition hover:opacity-90">
          <StatCard label="Residents" value={people.residents.toLocaleString()} hint="Browse profiles" />
        </Link>
        <Link href="/events" className="block transition hover:opacity-90">
          <StatCard
            label="Upcoming events"
            value={life.upcomingEvents.toLocaleString()}
            hint="View calendar"
          />
        </Link>
        <Link href="/opportunities" className="block transition hover:opacity-90">
          <StatCard
            label="Open opportunities"
            value={life.openOpportunities.toLocaleString()}
            hint="Jobs & mentorship"
          />
        </Link>
        <Link href="/map" className="block transition hover:opacity-90">
          <StatCard label="Amenities" value={String(society.stats.amenities)} hint="On the map" />
        </Link>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="cos-card p-5 md:p-6">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h2 className="cos-section-title">Sector population</h2>
            <span className="cos-pill bg-[var(--cos-teal-soft)] text-teal">Live</span>
          </div>
          <p className="cos-muted mb-4">Resident estimates by sector.</p>
          <VerticalBarChart data={sectorChart} />
        </div>

        <div className="cos-card p-5 md:p-6">
          <h2 className="cos-section-title">Talent pulse</h2>
          <p className="cos-muted mb-4 mt-1">Mentors, hiring, and work-seeking signals.</p>
          <DonutChart
            data={pulseChart}
            centerLabel="signals"
            centerValue={String(
              people.mentors + people.hiring + people.lookingForWork + life.connections,
            )}
          />
        </div>

        <div className="cos-card p-5 md:p-6">
          <h2 className="cos-section-title">Engagement</h2>
          <p className="cos-muted mb-4 mt-1">Posts, events, opportunities, households.</p>
          <HorizontalBars data={engagementChart} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="cos-card p-5 md:p-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="cos-section-title">Society Map</h2>
              <p className="cos-muted mt-1">Geography, amenities, and properties.</p>
            </div>
            <Link href="/map" className="text-sm font-semibold text-teal">
              Full map →
            </Link>
          </div>
          <div className="overflow-hidden rounded-[10px] border border-[var(--cos-border)]">
            <HomeMapPreview />
          </div>
        </div>

        <div className="space-y-4">
          <div className="cos-card p-5 md:p-6">
            <h2 className="cos-section-title">Opportunity kinds</h2>
            <p className="cos-muted mb-4 mt-1">Open roles by type.</p>
            {opportunityKinds.length ? (
              <DonutChart data={opportunityKinds} centerLabel="open" size={150} />
            ) : (
              <p className="text-sm text-[var(--cos-ink)]/50">No open opportunities yet.</p>
            )}
          </div>

          <div className="cos-card p-5 md:p-6">
            <h2 className="cos-section-title">Event interest</h2>
            <p className="cos-muted mb-4 mt-1">Going + interested RSVPs.</p>
            {eventRsvp.length ? (
              <HorizontalBars data={eventRsvp} />
            ) : (
              <p className="text-sm text-[var(--cos-ink)]/50">No upcoming events.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="cos-card p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="cos-section-title">Sectors</h2>
            <Link href="/geography" className="text-sm font-semibold text-teal">
              Geography →
            </Link>
          </div>
          <ul className="space-y-2">
            {sectors.map((sector) => (
              <li
                key={sector.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-[var(--cos-sand)] px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{sector.name}</p>
                  <p className="text-xs text-[color-mix(in_oklab,var(--cos-ink)_50%,transparent)]">
                    {sector.householdEstimate} households
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-ink">
                    {sector.residentEstimate.toLocaleString()}
                  </p>
                  <div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[var(--cos-teal)]"
                      style={{
                        width: `${Math.min(100, (sector.residentEstimate / 2000) * 100)}%`,
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
            <h2 className="cos-section-title">Facilities</h2>
            <Link href="/map" className="text-sm font-semibold text-teal">
              On map →
            </Link>
          </div>
          <ul className="space-y-2">
            {features.slice(0, 6).map((feature) => (
              <li
                key={feature.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-[var(--cos-border)] px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{feature.name}</p>
                  <p className="text-xs text-[color-mix(in_oklab,var(--cos-ink)_50%,transparent)]">
                    {feature.description}
                  </p>
                </div>
                <span className="cos-pill bg-[var(--cos-sand)] text-teal">
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
