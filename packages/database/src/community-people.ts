import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient, isSupabaseConfigured } from "./supabase-data.js";
import { DEMO_PEOPLE, type DemoResident } from "./demo/people.js";

const SOCIETY = "soc_demo_jaffar_e_tayyar";

export type ResidentListItem = {
  id: string;
  fullName: string;
  preferredName: string | null;
  headline: string | null;
  status: string;
  geoAreaId: string | null;
  geoAreaName: string | null;
  employmentStatus: string;
  openToMentoring: boolean;
  lookingForWork: boolean;
  hiring: boolean;
  volunteerAvail: boolean;
  primaryProfession: string | null;
  skills: string[];
};

export type ResidentDetail = ResidentListItem & {
  bio: string | null;
  email: string | null;
  phone: string | null;
  yearsExperience: number | null;
  openToNetworking: boolean;
  openToConsulting: boolean;
  openToFreelance: boolean;
  profileCompleteness: number;
  professions: Array<{ title: string | null; label: string; categoryLabel: string | null; isPrimary: boolean }>;
  employment: Array<{ employer: string | null; jobTitle: string; isCurrent: boolean; startYear: number | null }>;
  household: { id: string; label: string | null; role: string; isPrimary: boolean } | null;
};

export type HouseholdListItem = {
  id: string;
  label: string | null;
  propertyId: string | null;
  householdSize: number;
  primaryResidentId: string | null;
  members: Array<{ id: string; fullName: string; role: string; isPrimary: boolean; headline: string | null }>;
};

export type ProfessionalCategoryItem = {
  id: string;
  key: string;
  label: string;
  sortOrder: number;
  professions: Array<{ id: string; key: string; label: string }>;
};

function mapDemoResident(row: DemoResident, areaName: string | null): ResidentListItem {
  return {
    id: row.id,
    fullName: row.fullName,
    preferredName: row.preferredName,
    headline: row.headline,
    status: row.status,
    geoAreaId: row.geoAreaId,
    geoAreaName: areaName,
    employmentStatus: row.employmentStatus,
    openToMentoring: row.openToMentoring,
    lookingForWork: row.lookingForWork,
    hiring: row.hiring,
    volunteerAvail: row.volunteerAvail,
    primaryProfession: row.primaryProfession,
    skills: row.skills,
  };
}

function applyResidentFilters(
  rows: ResidentListItem[],
  filters: { q?: string; mentoring?: boolean; hiring?: boolean; lookingForWork?: boolean },
): ResidentListItem[] {
  let next = rows;
  if (filters.mentoring) next = next.filter((row) => row.openToMentoring);
  if (filters.hiring) next = next.filter((row) => row.hiring);
  if (filters.lookingForWork) next = next.filter((row) => row.lookingForWork);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    next = next.filter(
      (row) =>
        row.fullName.toLowerCase().includes(q) ||
        (row.headline ?? "").toLowerCase().includes(q) ||
        (row.primaryProfession ?? "").toLowerCase().includes(q) ||
        row.skills.some((skill) => skill.toLowerCase().includes(q)),
    );
  }
  return next;
}

function demoResidents(filters: {
  q?: string;
  mentoring?: boolean;
  hiring?: boolean;
  lookingForWork?: boolean;
}): ResidentListItem[] {
  const areaMap = new Map(DEMO_PEOPLE.areaNames.map((area) => [area.id, area.name]));
  const rows = DEMO_PEOPLE.residents.map((row) =>
    mapDemoResident(row, row.geoAreaId ? (areaMap.get(row.geoAreaId) ?? null) : null),
  );
  return applyResidentFilters(rows, filters);
}

async function loadResidentsFromSupabase(
  societyId: string,
  client: SupabaseClient,
): Promise<ResidentListItem[] | null> {
  const { data: residents, error } = await client
    .from("residents")
    .select(
      "id, fullName, preferredName, headline, status, geoAreaId, employmentStatus, openToMentoring, lookingForWork, hiring, volunteerAvail",
    )
    .eq("societyId", societyId)
    .eq("status", "active")
    .order("fullName");
  if (error) throw error;
  if (!residents?.length) return null;

  const residentIds = residents.map((row) => row.id as string);
  const areaIds = [...new Set(residents.map((row) => row.geoAreaId).filter(Boolean))] as string[];

  const [{ data: areas }, { data: professionLinks }, { data: skillLinks }, { data: professions }, { data: skills }] =
    await Promise.all([
      areaIds.length
        ? client.from("geo_areas").select("id, name").in("id", areaIds)
        : Promise.resolve({ data: [] as Array<{ id: string; name: string }> }),
      client
        .from("resident_professions")
        .select("residentId, professionId, title, isPrimary")
        .in("residentId", residentIds),
      client.from("resident_skills").select("residentId, skillId").in("residentId", residentIds),
      client.from("professions").select("id, label").eq("societyId", societyId),
      client.from("skills").select("id, label").eq("societyId", societyId),
    ]);

  const areaMap = new Map((areas ?? []).map((area) => [area.id as string, area.name as string]));
  const professionMap = new Map((professions ?? []).map((row) => [row.id as string, row.label as string]));
  const skillMap = new Map((skills ?? []).map((row) => [row.id as string, row.label as string]));

  const primaryProfessionByResident = new Map<string, string>();
  for (const link of professionLinks ?? []) {
    const residentId = link.residentId as string;
    if (primaryProfessionByResident.has(residentId) && !link.isPrimary) continue;
    const label = (link.title as string | null) ?? professionMap.get(link.professionId as string) ?? null;
    if (label) primaryProfessionByResident.set(residentId, label);
  }

  const skillsByResident = new Map<string, string[]>();
  for (const link of skillLinks ?? []) {
    const label = skillMap.get(link.skillId as string);
    if (!label) continue;
    const list = skillsByResident.get(link.residentId as string) ?? [];
    list.push(label);
    skillsByResident.set(link.residentId as string, list);
  }

  return residents.map((row) => ({
    id: row.id as string,
    fullName: row.fullName as string,
    preferredName: (row.preferredName as string | null) ?? null,
    headline: (row.headline as string | null) ?? null,
    status: row.status as string,
    geoAreaId: (row.geoAreaId as string | null) ?? null,
    geoAreaName: row.geoAreaId ? (areaMap.get(row.geoAreaId as string) ?? null) : null,
    employmentStatus: row.employmentStatus as string,
    openToMentoring: Boolean(row.openToMentoring),
    lookingForWork: Boolean(row.lookingForWork),
    hiring: Boolean(row.hiring),
    volunteerAvail: Boolean(row.volunteerAvail),
    primaryProfession: primaryProfessionByResident.get(row.id as string) ?? null,
    skills: skillsByResident.get(row.id as string) ?? [],
  }));
}

export async function listResidents(
  societyId: string = SOCIETY,
  filters: { q?: string; mentoring?: boolean; hiring?: boolean; lookingForWork?: boolean } = {},
): Promise<{ data: ResidentListItem[]; source: "supabase" | "demo" }> {
  if (isSupabaseConfigured()) {
    try {
      const client = createServiceClient();
      const rows = await loadResidentsFromSupabase(societyId, client);
      if (rows) {
        return { data: applyResidentFilters(rows, filters), source: "supabase" };
      }
    } catch (error) {
      console.warn("Supabase residents load failed; falling back to demo.", error);
    }
  }
  return { data: demoResidents(filters), source: "demo" };
}

export async function getResidentDetail(
  residentId: string,
  societyId: string = SOCIETY,
): Promise<{ data: ResidentDetail; source: "supabase" | "demo" } | null> {
  if (isSupabaseConfigured()) {
    try {
      const client = createServiceClient();
      const { data: row, error } = await client
        .from("residents")
        .select("*")
        .eq("id", residentId)
        .eq("societyId", societyId)
        .maybeSingle();
      if (error) throw error;
      if (row) {
        const list = await loadResidentsFromSupabase(societyId, client);
        const base = list?.find((item) => item.id === residentId);
        if (!base) return null;

        const [{ data: professionLinks }, { data: employment }, { data: membership }, { data: professions }, { data: categories }] =
          await Promise.all([
            client
              .from("resident_professions")
              .select("title, isPrimary, professionId")
              .eq("residentId", residentId),
            client
              .from("employment_records")
              .select("employer, jobTitle, isCurrent, startYear")
              .eq("residentId", residentId)
              .order("isCurrent", { ascending: false }),
            client
              .from("household_members")
              .select("role, isPrimary, householdId")
              .eq("residentId", residentId)
              .limit(1)
              .maybeSingle(),
            client.from("professions").select("id, label, categoryId").eq("societyId", societyId),
            client.from("professional_categories").select("id, label").eq("societyId", societyId),
          ]);

        const categoryMap = new Map((categories ?? []).map((c) => [c.id as string, c.label as string]));
        const professionMap = new Map(
          (professions ?? []).map((p) => [
            p.id as string,
            { label: p.label as string, categoryLabel: categoryMap.get(p.categoryId as string) ?? null },
          ]),
        );

        let household: ResidentDetail["household"] = null;
        if (membership?.householdId) {
          const { data: hh } = await client
            .from("households")
            .select("id, label")
            .eq("id", membership.householdId)
            .maybeSingle();
          if (hh) {
            household = {
              id: hh.id as string,
              label: (hh.label as string | null) ?? null,
              role: membership.role as string,
              isPrimary: Boolean(membership.isPrimary),
            };
          }
        }

        return {
          source: "supabase",
          data: {
            ...base,
            bio: (row.bio as string | null) ?? null,
            email: (row.email as string | null) ?? null,
            phone: (row.phone as string | null) ?? null,
            yearsExperience: (row.yearsExperience as number | null) ?? null,
            openToNetworking: Boolean(row.openToNetworking),
            openToConsulting: Boolean(row.openToConsulting),
            openToFreelance: Boolean(row.openToFreelance),
            profileCompleteness: (row.profileCompleteness as number) ?? 0,
            professions: (professionLinks ?? []).map((link) => {
              const profession = professionMap.get(link.professionId as string);
              return {
                title: (link.title as string | null) ?? null,
                label: profession?.label ?? "Profession",
                categoryLabel: profession?.categoryLabel ?? null,
                isPrimary: Boolean(link.isPrimary),
              };
            }),
            employment: (employment ?? []).map((item) => ({
              employer: (item.employer as string | null) ?? null,
              jobTitle: item.jobTitle as string,
              isCurrent: Boolean(item.isCurrent),
              startYear: (item.startYear as number | null) ?? null,
            })),
            household,
          },
        };
      }
    } catch (error) {
      console.warn("Supabase resident detail failed; falling back to demo.", error);
    }
  }

  const demo = DEMO_PEOPLE.residents.find((row) => row.id === residentId);
  if (!demo) return null;
  const areaName = demo.geoAreaId
    ? (DEMO_PEOPLE.areaNames.find((area) => area.id === demo.geoAreaId)?.name ?? null)
    : null;
  const membership = DEMO_PEOPLE.memberships.find((item) => item.residentId === residentId);
  const household = membership
    ? DEMO_PEOPLE.households.find((item) => item.id === membership.householdId)
    : null;

  return {
    source: "demo",
    data: {
      ...mapDemoResident(demo, areaName),
      bio: demo.bio,
      email: demo.email,
      phone: demo.phone,
      yearsExperience: demo.yearsExperience,
      openToNetworking: demo.openToNetworking,
      openToConsulting: demo.openToConsulting,
      openToFreelance: demo.openToFreelance,
      profileCompleteness: demo.profileCompleteness,
      professions: demo.professions,
      employment: demo.employment,
      household: household
        ? {
            id: household.id,
            label: household.label,
            role: membership!.role,
            isPrimary: membership!.isPrimary,
          }
        : null,
    },
  };
}

export async function listHouseholds(
  societyId: string = SOCIETY,
): Promise<{ data: HouseholdListItem[]; source: "supabase" | "demo" }> {
  if (isSupabaseConfigured()) {
    try {
      const client = createServiceClient();
      const { data: households, error } = await client
        .from("households")
        .select("id, label, propertyId, householdSize, primaryResidentId")
        .eq("societyId", societyId)
        .order("label");
      if (error) throw error;
      if (households?.length) {
        const ids = households.map((row) => row.id as string);
        const { data: members } = await client
          .from("household_members")
          .select("householdId, role, isPrimary, residentId")
          .in("householdId", ids);
        const residentIds = [...new Set((members ?? []).map((m) => m.residentId as string))];
        const { data: residents } = await client
          .from("residents")
          .select("id, fullName, headline")
          .in("id", residentIds);
        const residentMap = new Map(
          (residents ?? []).map((row) => [
            row.id as string,
            { fullName: row.fullName as string, headline: (row.headline as string | null) ?? null },
          ]),
        );

        return {
          source: "supabase",
          data: households.map((hh) => ({
            id: hh.id as string,
            label: (hh.label as string | null) ?? null,
            propertyId: (hh.propertyId as string | null) ?? null,
            householdSize: (hh.householdSize as number) ?? 1,
            primaryResidentId: (hh.primaryResidentId as string | null) ?? null,
            members: (members ?? [])
              .filter((member) => member.householdId === hh.id)
              .map((member) => {
                const resident = residentMap.get(member.residentId as string);
                return {
                  id: member.residentId as string,
                  fullName: resident?.fullName ?? "Resident",
                  role: member.role as string,
                  isPrimary: Boolean(member.isPrimary),
                  headline: resident?.headline ?? null,
                };
              }),
          })),
        };
      }
    } catch (error) {
      console.warn("Supabase households load failed; falling back to demo.", error);
    }
  }

  return {
    source: "demo",
    data: DEMO_PEOPLE.households.map((hh) => ({
      id: hh.id,
      label: hh.label,
      propertyId: hh.propertyId,
      householdSize: hh.householdSize,
      primaryResidentId: hh.primaryResidentId,
      members: DEMO_PEOPLE.memberships
        .filter((member) => member.householdId === hh.id)
        .map((member) => {
          const resident = DEMO_PEOPLE.residents.find((row) => row.id === member.residentId);
          return {
            id: member.residentId,
            fullName: resident?.fullName ?? "Resident",
            role: member.role,
            isPrimary: member.isPrimary,
            headline: resident?.headline ?? null,
          };
        }),
    })),
  };
}

export async function listProfessionalCategories(
  societyId: string = SOCIETY,
): Promise<{ data: ProfessionalCategoryItem[]; source: "supabase" | "demo" }> {
  if (isSupabaseConfigured()) {
    try {
      const client = createServiceClient();
      const { data: categories, error } = await client
        .from("professional_categories")
        .select("id, key, label, sortOrder")
        .eq("societyId", societyId)
        .order("sortOrder");
      if (error) throw error;
      if (categories?.length) {
        const { data: professions } = await client
          .from("professions")
          .select("id, key, label, categoryId")
          .eq("societyId", societyId);
        return {
          source: "supabase",
          data: categories.map((category) => ({
            id: category.id as string,
            key: category.key as string,
            label: category.label as string,
            sortOrder: (category.sortOrder as number) ?? 0,
            professions: (professions ?? [])
              .filter((profession) => profession.categoryId === category.id)
              .map((profession) => ({
                id: profession.id as string,
                key: profession.key as string,
                label: profession.label as string,
              })),
          })),
        };
      }
    } catch (error) {
      console.warn("Supabase professional categories failed; falling back to demo.", error);
    }
  }

  return { data: DEMO_PEOPLE.categories, source: "demo" };
}

export async function listProfessionals(
  societyId: string = SOCIETY,
  filters: { categoryKey?: string; professionKey?: string; mentoring?: boolean; q?: string } = {},
): Promise<{ data: ResidentListItem[]; source: "supabase" | "demo" }> {
  const residents = await listResidents(societyId, {
    q: filters.q,
    mentoring: filters.mentoring,
  });

  if (!filters.categoryKey && !filters.professionKey) {
    return {
      source: residents.source,
      data: residents.data.filter((row) => row.primaryProfession),
    };
  }

  if (residents.source === "demo") {
    const allowedProfessionKeys = new Set(
      DEMO_PEOPLE.categories
        .filter((category) => !filters.categoryKey || category.key === filters.categoryKey)
        .flatMap((category) => category.professions)
        .filter((profession) => !filters.professionKey || profession.key === filters.professionKey)
        .map((profession) => profession.key),
    );
    const allowedResidentIds = new Set(
      DEMO_PEOPLE.residents
        .filter((row) => row.professionKeys.some((key) => allowedProfessionKeys.has(key)))
        .map((row) => row.id),
    );
    return {
      source: "demo",
      data: residents.data.filter((row) => allowedResidentIds.has(row.id)),
    };
  }

  const client = createServiceClient();
  const { data: professions, error } = await client
    .from("professions")
    .select("id, key, categoryId")
    .eq("societyId", societyId);
  if (error) throw error;

  const { data: categories } = await client
    .from("professional_categories")
    .select("id, key")
    .eq("societyId", societyId);
  const categoryKeyById = new Map((categories ?? []).map((row) => [row.id as string, row.key as string]));

  const allowedIds = new Set(
    (professions ?? [])
      .filter((profession) => {
        if (filters.professionKey && profession.key !== filters.professionKey) return false;
        if (
          filters.categoryKey &&
          categoryKeyById.get(profession.categoryId as string) !== filters.categoryKey
        ) {
          return false;
        }
        return true;
      })
      .map((profession) => profession.id as string),
  );

  const { data: links } = await client
    .from("resident_professions")
    .select("residentId, professionId")
    .in("professionId", [...allowedIds]);
  const residentIds = new Set((links ?? []).map((link) => link.residentId as string));

  return {
    source: "supabase",
    data: residents.data.filter((row) => residentIds.has(row.id)),
  };
}

export async function getCommunityPeopleStats(societyId: string = SOCIETY) {
  const [residents, households] = await Promise.all([
    listResidents(societyId),
    listHouseholds(societyId),
  ]);
  return {
    residents: residents.data.length,
    households: households.data.length,
    mentors: residents.data.filter((row) => row.openToMentoring).length,
    hiring: residents.data.filter((row) => row.hiring).length,
    lookingForWork: residents.data.filter((row) => row.lookingForWork).length,
    source: residents.source,
  };
}
