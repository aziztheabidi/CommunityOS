import { ResidentDetailClient } from "./resident-detail-client";

export default async function ResidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResidentDetailClient residentId={id} />;
}
