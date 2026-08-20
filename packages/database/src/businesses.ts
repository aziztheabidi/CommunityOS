import { createServiceClient, isSupabaseConfigured } from "./supabase-data.js";
import { DEMO_BUSINESS_CATEGORIES, DEMO_BUSINESSES, type DemoBusiness } from "./demo/businesses.js";

const SOCIETY = "soc_demo_jaffar_e_tayyar";

export type BusinessListItem = DemoBusiness;

function applyFilters(
  rows: BusinessListItem[],
  filters: { q?: string; categoryKey?: string; hiring?: boolean; residentOwned?: boolean },
) {
  let next = rows;
  if (filters.categoryKey) next = next.filter((row) => row.categoryKey === filters.categoryKey);
  if (filters.hiring) next = next.filter((row) => row.isHiring);
  if (filters.residentOwned) next = next.filter((row) => row.isResidentOwned);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    next = next.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.summary.toLowerCase().includes(q) ||
        row.categoryLabel.toLowerCase().includes(q) ||
        row.services.some((service) => service.toLowerCase().includes(q)),
    );
  }
  return next;
}

export async function listBusinessCategories(societyId: string = SOCIETY) {
  if (isSupabaseConfigured()) {
    try {
      const client = createServiceClient();
      const { data, error } = await client
        .from("business_categories")
        .select("id, key, label, sortOrder")
        .eq("societyId", societyId)
        .order("sortOrder");
      if (error) throw error;
      if (data?.length) {
        return {
          source: "supabase" as const,
          data: data.map((row) => ({
            id: row.id as string,
            key: row.key as string,
            label: row.label as string,
            sortOrder: (row.sortOrder as number) ?? 0,
          })),
        };
      }
    } catch (error) {
      console.warn("Supabase business categories failed; falling back to demo.", error);
    }
  }
  return { source: "demo" as const, data: DEMO_BUSINESS_CATEGORIES };
}

export async function listBusinesses(
  societyId: string = SOCIETY,
  filters: { q?: string; categoryKey?: string; hiring?: boolean; residentOwned?: boolean } = {},
) {
  if (isSupabaseConfigured()) {
    try {
      const client = createServiceClient();
      const { data: businesses, error } = await client
        .from("businesses")
        .select("*")
        .eq("societyId", societyId)
        .order("name");
      if (error) throw error;
      if (businesses?.length) {
        const ids = businesses.map((row) => row.id as string);
        const categoryIds = [
          ...new Set(businesses.map((row) => row.categoryId).filter(Boolean)),
        ] as string[];
        const areaIds = [...new Set(businesses.map((row) => row.geoAreaId).filter(Boolean))] as string[];

        const [{ data: categories }, { data: areas }, { data: owners }, { data: services }] =
          await Promise.all([
            categoryIds.length
              ? client.from("business_categories").select("id, key, label").in("id", categoryIds)
              : Promise.resolve({ data: [] as Array<{ id: string; key: string; label: string }> }),
            areaIds.length
              ? client.from("geo_areas").select("id, name").in("id", areaIds)
              : Promise.resolve({ data: [] as Array<{ id: string; name: string }> }),
            client
              .from("business_owners")
              .select("businessId, residentId, title, isPrimary")
              .in("businessId", ids),
            client.from("business_services").select("businessId, name").in("businessId", ids),
          ]);

        const residentIds = [...new Set((owners ?? []).map((row) => row.residentId as string))];
        const { data: residents } = residentIds.length
          ? await client.from("residents").select("id, fullName").in("id", residentIds)
          : { data: [] as Array<{ id: string; fullName: string }> };

        const categoryMap = new Map(
          (categories ?? []).map((row) => [
            row.id as string,
            { key: row.key as string, label: row.label as string },
          ]),
        );
        const areaMap = new Map((areas ?? []).map((row) => [row.id as string, row.name as string]));
        const residentMap = new Map(
          (residents ?? []).map((row) => [row.id as string, row.fullName as string]),
        );

        const mapped: BusinessListItem[] = businesses.map((row) => {
          const category = row.categoryId
            ? categoryMap.get(row.categoryId as string)
            : undefined;
          return {
            id: row.id as string,
            name: row.name as string,
            slug: row.slug as string,
            summary: (row.summary as string | null) ?? "",
            description: (row.description as string | null) ?? "",
            categoryKey: category?.key ?? "other",
            categoryLabel: category?.label ?? "Other",
            phone: (row.phone as string | null) ?? null,
            geoAreaId: (row.geoAreaId as string | null) ?? null,
            geoAreaName: row.geoAreaId ? (areaMap.get(row.geoAreaId as string) ?? null) : null,
            addressLine: (row.addressLine as string | null) ?? null,
            isResidentOwned: Boolean(row.isResidentOwned),
            isHiring: Boolean(row.isHiring),
            offersResidentDiscount: Boolean(row.offersResidentDiscount),
            verification: row.verification as string,
            owners: (owners ?? [])
              .filter((owner) => owner.businessId === row.id)
              .map((owner) => ({
                residentId: owner.residentId as string,
                fullName: residentMap.get(owner.residentId as string) ?? "Owner",
                title: (owner.title as string | null) ?? null,
              })),
            services: (services ?? [])
              .filter((service) => service.businessId === row.id)
              .map((service) => service.name as string),
            geomJson: (row.geomJson as BusinessListItem["geomJson"]) ?? null,
          };
        });

        return { source: "supabase" as const, data: applyFilters(mapped, filters) };
      }
    } catch (error) {
      console.warn("Supabase businesses load failed; falling back to demo.", error);
    }
  }

  return { source: "demo" as const, data: applyFilters(DEMO_BUSINESSES, filters) };
}

export async function getBusinessDetail(businessId: string, societyId: string = SOCIETY) {
  const { data, source } = await listBusinesses(societyId);
  const business = data.find((row) => row.id === businessId || row.slug === businessId);
  if (!business) return null;
  return { data: business, source };
}
