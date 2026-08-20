import Link from "next/link";
import { Button, StatCard } from "@communityos/ui";
import { HomeMapPreview } from "@/components/home-map-preview";
import { fetchSociety, fetchGeoAreas, fetchFeatures } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let society;
  let sectors;
  let features;

  try {
    [{ data: society }, { data: sectors }, { data: features }] = await Promise.all([
      fetchSociety(),
      fetchGeoAreas(undefined, "sector"),
      fetchFeatures(),
    ]);
  } catch {
    return (
      <div className="cos-card p-8">
        <h1 className="font-display text-3xl text-ink">API offline</h1>
        <p className="mt-3 text-sm text-[color-mix(in_oklab,var(--cos-ink)_70%,transparent)]">
          Start the API (`pnpm --filter @communityos/api dev` or `pnpm dev`) so demo geography data
          can load. Default endpoint: http://localhost:4000
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[1.6rem] border border-[var(--cos-border)] bg-[linear-gradient(135deg,#fffcf7_0%,#e8f4f4_45%,#f7efe4_100%)] p-6 shadow-[var(--cos-shadow)] md:p-8">
        <div className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(15,107,107,0.18),transparent_70%)]" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">
          Good evening, Administrator
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-ink md:text-5xl">
          {society.name}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color-mix(in_oklab,var(--cos-ink)_72%,transparent)]">
          {society.settings.branding.tagline} Explore geography, people, businesses, events, and
          opportunities on one Community Graph.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/map">
            <Button>Open Society Map</Button>
          </Link>
          <Link href="/feed">
            <Button variant="secondary">Society feed</Button>
          </Link>
          <Link href="/opportunities">
            <Button variant="secondary">Opportunities</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/residents" className="block transition hover:-translate-y-0.5">
          <StatCard
            label="Residents"
            value={society.stats.residents.toLocaleString()}
            hint="Profiles · click to browse"
          />
        </Link>
        <Link href="/events" className="block transition hover:-translate-y-0.5">
          <StatCard
            label="Upcoming events"
            value={society.stats.upcomingEvents.toLocaleString()}
            hint="RSVP-ready calendar"
          />
        </Link>
        <Link href="/opportunities" className="block transition hover:-translate-y-0.5">
          <StatCard
            label="Open opportunities"
            value={society.stats.openOpportunities.toLocaleString()}
            hint="Jobs · mentorship · volunteer"
          />
        </Link>
        <Link href="/map" className="block transition hover:-translate-y-0.5">
          <StatCard
            label="Amenities"
            value={String(society.stats.amenities)}
            hint="Gates, parks, clinic, school…"
          />
        </Link>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="cos-card p-5 md:p-6">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-ink">Society Map</h2>
              <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cos-ink)_65%,transparent)]">
                Phases, sectors, amenities, and sample properties.
              </p>
            </div>
            <Link href="/map" className="text-sm font-semibold text-teal">
              Full map →
            </Link>
          </div>
          <HomeMapPreview />
        </div>

        <div className="space-y-6">
          <div className="cos-card p-5 md:p-6">
            <h2 className="font-display text-2xl text-ink">Sector pulse</h2>
            <p className="mt-1 text-sm text-[color-mix(in_oklab,var(--cos-ink)_65%,transparent)]">
              Estimated population by sector (demo).
            </p>
            <ul className="mt-4 space-y-3">
              {sectors.map((sector) => (
                <li key={sector.id} className="flex items-center justify-between gap-3">
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
                    <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-[var(--cos-sand-deep)]">
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
            <h2 className="font-display text-2xl text-ink">Facilities</h2>
            <ul className="mt-4 space-y-2">
              {features.slice(0, 5).map((feature) => (
                <li
                  key={feature.id}
                  className="flex items-start justify-between gap-3 rounded-xl bg-[var(--cos-sand)]/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{feature.name}</p>
                    <p className="text-xs text-[color-mix(in_oklab,var(--cos-ink)_55%,transparent)]">
                      {feature.description}
                    </p>
                  </div>
                  <span className="cos-pill bg-white text-[var(--cos-teal)]">
                    {feature.featureType.replaceAll("_", " ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
