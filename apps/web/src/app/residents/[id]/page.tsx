import { ResidentDetailClient } from "./resident-detail-client";

const STATIC_RESIDENT_IDS = [
  "res_ahmed_khan",
  "res_sara_malik",
  "res_bilal_hussain",
  "res_fatima_zahra",
  "res_omar_siddiqui",
  "res_aisha_rauf",
  "res_hamza_ali",
  "res_nadia_imran",
  "res_usman_raza",
  "res_maryam_noor",
  "res_zain_abbas",
  "res_hana_qureshi",
] as const;

export function generateStaticParams() {
  return STATIC_RESIDENT_IDS.map((id) => ({ id }));
}

export default async function ResidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResidentDetailClient residentId={id} />;
}
