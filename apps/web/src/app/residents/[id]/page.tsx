"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchResident, type ResidentDetail } from "@/lib/api";

export default function ResidentDetailPage() {
  const params = useParams<{ id: string }>();
  const residentId = params.id;
  const [resident, setResident] = useState<ResidentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!residentId) return;
    let cancelled = false;
    setLoading(true);
    fetchResident(residentId)
      .then((response) => {
        if (!cancelled) {
          setResident(response.data);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [residentId]);

  if (loading) {
    return <div className="cos-card p-8 text-[var(--cos-ink)]/50">Loading profile…</div>;
  }

  if (error || !resident) {
    return (
      <div className="cos-card space-y-3 p-8">
        <h1 className="font-display text-3xl text-ink">Resident not found</h1>
        <p className="text-sm text-[var(--cos-danger)]">{error ?? "Unknown resident"}</p>
        <Link href="/residents" className="text-sm font-semibold text-teal">
          ← Back to residents
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/residents" className="text-sm font-semibold text-teal">
        ← Residents
      </Link>

      <section className="relative overflow-hidden rounded-[1.6rem] border border-[var(--cos-border)] bg-[linear-gradient(135deg,#fffcf7_0%,#e8f4f4_55%,#f7efe4_100%)] p-6 shadow-[var(--cos-shadow)] md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal">
          {resident.geoAreaName ?? "Society resident"}
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">{resident.fullName}</h1>
        <p className="mt-3 max-w-2xl text-base text-[color-mix(in_oklab,var(--cos-ink)_72%,transparent)]">
          {resident.headline}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {resident.openToMentoring ? (
            <span className="cos-pill bg-emerald-100 text-emerald-800">Open to mentoring</span>
          ) : null}
          {resident.hiring ? (
            <span className="cos-pill bg-amber-100 text-amber-900">Hiring</span>
          ) : null}
          {resident.lookingForWork ? (
            <span className="cos-pill bg-sky-100 text-sky-900">Looking for work</span>
          ) : null}
          {resident.volunteerAvail ? (
            <span className="cos-pill bg-white text-teal">Volunteer available</span>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <div className="cos-card p-5 md:p-6">
            <h2 className="font-display text-2xl text-ink">About</h2>
            <p className="mt-3 text-sm leading-relaxed text-[color-mix(in_oklab,var(--cos-ink)_75%,transparent)]">
              {resident.bio ?? "No bio provided."}
            </p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--cos-ink)]/50">Employment</dt>
                <dd className="mt-1 text-sm font-semibold capitalize">
                  {resident.employmentStatus.replaceAll("_", " ")}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--cos-ink)]/50">Experience</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {resident.yearsExperience != null ? `${resident.yearsExperience} years` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[var(--cos-ink)]/50">Profile</dt>
                <dd className="mt-1 text-sm font-semibold">{resident.profileCompleteness}% complete</dd>
              </div>
            </dl>
          </div>

          <div className="cos-card p-5 md:p-6">
            <h2 className="font-display text-2xl text-ink">Professions</h2>
            <ul className="mt-4 space-y-3">
              {resident.professions.map((profession) => (
                <li
                  key={`${profession.label}-${profession.title}`}
                  className="rounded-xl bg-[var(--cos-sand)]/60 px-3 py-3"
                >
                  <p className="text-sm font-semibold text-ink">
                    {profession.title ?? profession.label}
                    {profession.isPrimary ? (
                      <span className="ml-2 text-xs font-medium text-teal">Primary</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-[var(--cos-ink)]/55">
                    {[profession.label, profession.categoryLabel].filter(Boolean).join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="cos-card p-5 md:p-6">
            <h2 className="font-display text-2xl text-ink">Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {resident.skills.length ? (
                resident.skills.map((skill) => (
                  <span key={skill} className="cos-pill bg-white text-teal">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[var(--cos-ink)]/50">No skills listed.</p>
              )}
            </div>
          </div>

          <div className="cos-card p-5 md:p-6">
            <h2 className="font-display text-2xl text-ink">Employment</h2>
            <ul className="mt-4 space-y-3">
              {resident.employment.map((job) => (
                <li key={`${job.jobTitle}-${job.startYear}`}>
                  <p className="text-sm font-semibold text-ink">{job.jobTitle}</p>
                  <p className="text-xs text-[var(--cos-ink)]/55">
                    {[job.employer, job.startYear ? `since ${job.startYear}` : null, job.isCurrent ? "current" : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="cos-card p-5 md:p-6">
            <h2 className="font-display text-2xl text-ink">Household</h2>
            {resident.household ? (
              <div className="mt-3">
                <p className="text-sm font-semibold text-ink">
                  {resident.household.label ?? "Household"}
                </p>
                <p className="text-xs capitalize text-[var(--cos-ink)]/55">
                  {resident.household.role}
                  {resident.household.isPrimary ? " · primary" : ""}
                </p>
                <Link href="/households" className="mt-3 inline-block text-sm font-semibold text-teal">
                  Browse households →
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--cos-ink)]/50">No household linked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
