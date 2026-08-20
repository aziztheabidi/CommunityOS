import { societyLngLat } from "./location.js";

function bizPoint(dx: number, dy: number) {
  return { type: "Point" as const, coordinates: societyLngLat(dx, dy) };
}

export type DemoBusiness = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  categoryKey: string;
  categoryLabel: string;
  phone: string | null;
  geoAreaId: string | null;
  geoAreaName: string | null;
  addressLine: string | null;
  isResidentOwned: boolean;
  isHiring: boolean;
  offersResidentDiscount: boolean;
  verification: string;
  owners: Array<{ residentId: string; fullName: string; title: string | null }>;
  services: string[];
  geomJson: { type: "Point"; coordinates: [number, number] } | null;
};

export const DEMO_BUSINESSES: DemoBusiness[] = [
  {
    id: "biz_plaza_market",
    name: "Plaza Market Store",
    slug: "plaza-market-store",
    summary: "Everyday grocery and household goods.",
    description: "Resident-owned retail shop serving Sector D.",
    categoryKey: "retail",
    categoryLabel: "Retail",
    phone: "+92-300-2200001",
    geoAreaId: "area_block_d1",
    geoAreaName: "Block D1",
    addressLine: "Plaza Lane, Block D1",
    isResidentOwned: true,
    isHiring: true,
    offersResidentDiscount: true,
    verification: "verified",
    owners: [{ residentId: "res_hamza_ali", fullName: "Hamza Ali", title: "Owner" }],
    services: ["Grocery staples", "Home delivery"],
    geomJson: bizPoint(0.006, -0.005),
  },
  {
    id: "biz_smilecare",
    name: "SmileCare Dental",
    slug: "smilecare-dental",
    summary: "Family dentistry inside the society.",
    description: "Preventive and restorative dental care with resident hours.",
    categoryKey: "health",
    categoryLabel: "Health",
    phone: "+92-300-2200002",
    geoAreaId: "area_sector_c",
    geoAreaName: "Sector C",
    addressLine: "Clinic Row, Sector C",
    isResidentOwned: true,
    isHiring: false,
    offersResidentDiscount: true,
    verification: "verified",
    owners: [{ residentId: "res_hana_qureshi", fullName: "Hana Qureshi", title: "Clinic Lead" }],
    services: ["Dental checkup"],
    geomJson: bizPoint(-0.006, -0.004),
  },
  {
    id: "biz_imran_advisory",
    name: "Imran Advisory",
    slug: "imran-advisory",
    summary: "Tax and SME accounting.",
    description: "Bookkeeping, filings, and advisory for local businesses.",
    categoryKey: "professional",
    categoryLabel: "Professional Services",
    phone: "+92-300-2200003",
    geoAreaId: "area_sector_e",
    geoAreaName: "Sector E",
    addressLine: "Office Suite E-03",
    isResidentOwned: true,
    isHiring: false,
    offersResidentDiscount: false,
    verification: "verified",
    owners: [{ residentId: "res_nadia_imran", fullName: "Nadia Imran", title: "Principal" }],
    services: ["Tax filing"],
    geomJson: bizPoint(0.012, -0.004),
  },
  {
    id: "biz_raza_electrical",
    name: "Raza Electrical Services",
    slug: "raza-electrical",
    summary: "Licensed residential electrical work.",
    description: "Installations, repairs, and emergency call-outs within the society.",
    categoryKey: "services",
    categoryLabel: "Home Services",
    phone: "+92-300-2200004",
    geoAreaId: "area_sector_e",
    geoAreaName: "Sector E",
    addressLine: "Sector E service lane",
    isResidentOwned: true,
    isHiring: false,
    offersResidentDiscount: true,
    verification: "pending",
    owners: [{ residentId: "res_usman_raza", fullName: "Usman Raza", title: "Owner" }],
    services: ["Rewiring"],
    geomJson: bizPoint(0.013, -0.005),
  },
  {
    id: "biz_abbas_plumbing",
    name: "Abbas Plumbing",
    slug: "abbas-plumbing",
    summary: "Emergency and scheduled plumbing.",
    description: "Trusted local plumber for households and commercial units.",
    categoryKey: "services",
    categoryLabel: "Home Services",
    phone: "+92-300-2200005",
    geoAreaId: "area_block_b2",
    geoAreaName: "Block B2",
    addressLine: "Block B2 workshops",
    isResidentOwned: true,
    isHiring: false,
    offersResidentDiscount: true,
    verification: "verified",
    owners: [{ residentId: "res_zain_abbas", fullName: "Zain Abbas", title: "Owner" }],
    services: ["Leak repair"],
    geomJson: bizPoint(0.002, 0.0072),
  },
  {
    id: "biz_corner_cafe",
    name: "Corner Café",
    slug: "corner-cafe",
    summary: "Neighborhood café near Gate 2.",
    description: "Tea, snacks, and light meals for residents and visitors.",
    categoryKey: "food",
    categoryLabel: "Food & Dining",
    phone: "+92-300-2200006",
    geoAreaId: "area_block_a1",
    geoAreaName: "Block A1",
    addressLine: "Near Gate 2",
    isResidentOwned: true,
    isHiring: true,
    offersResidentDiscount: false,
    verification: "unverified",
    owners: [{ residentId: "res_ahmed_khan", fullName: "Ahmed Khan", title: "Co-owner" }],
    services: ["Tea & snacks"],
    geomJson: bizPoint(-0.004, -0.0082),
  },
];

export const DEMO_BUSINESS_CATEGORIES = [
  { id: "bcat_retail", key: "retail", label: "Retail", sortOrder: 1 },
  { id: "bcat_food", key: "food", label: "Food & Dining", sortOrder: 2 },
  { id: "bcat_services", key: "services", label: "Home Services", sortOrder: 3 },
  { id: "bcat_health", key: "health", label: "Health", sortOrder: 4 },
  { id: "bcat_professional", key: "professional", label: "Professional Services", sortOrder: 5 },
];
