-- Seed businesses for Jaffar-e-Tayyar Society
-- Run AFTER m2-m3 residents seed + m4-bootstrap.sql

BEGIN;

INSERT INTO business_categories (id, "societyId", key, label, "sortOrder", "createdAt", "updatedAt") VALUES
('bcat_retail', 'soc_demo_jaffar_e_tayyar', 'retail', 'Retail', 1, now(), now()),
('bcat_food', 'soc_demo_jaffar_e_tayyar', 'food', 'Food & Dining', 2, now(), now()),
('bcat_services', 'soc_demo_jaffar_e_tayyar', 'services', 'Home Services', 3, now(), now()),
('bcat_health', 'soc_demo_jaffar_e_tayyar', 'health', 'Health', 4, now(), now()),
('bcat_professional', 'soc_demo_jaffar_e_tayyar', 'professional', 'Professional Services', 5, now(), now())
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, "updatedAt" = now();

INSERT INTO businesses (id, "societyId", "categoryId", name, slug, summary, description, phone, "geoAreaId", "addressLine", "geomJson", "isResidentOwned", "isHiring", "offersResidentDiscount", verification, visibility, "createdAt", "updatedAt") VALUES
('biz_plaza_market', 'soc_demo_jaffar_e_tayyar', 'bcat_retail', 'Plaza Market Store', 'plaza-market-store', 'Everyday grocery and household goods.', 'Resident-owned retail shop serving Sector D.', '+92-300-2200001', 'area_block_d1', 'Plaza Lane, Block D1', '{"type":"Point","coordinates":[67.0822,24.9051]}'::jsonb, true, true, true, 'verified', 'members', now(), now()),
('biz_smilecare', 'soc_demo_jaffar_e_tayyar', 'bcat_health', 'SmileCare Dental', 'smilecare-dental', 'Family dentistry inside the society.', 'Preventive and restorative dental care with resident hours.', '+92-300-2200002', 'area_sector_c', 'Clinic Row, Sector C', '{"type":"Point","coordinates":[67.0798,24.9078]}'::jsonb, true, false, true, 'verified', 'members', now(), now()),
('biz_imran_advisory', 'soc_demo_jaffar_e_tayyar', 'bcat_professional', 'Imran Advisory', 'imran-advisory', 'Tax and SME accounting.', 'Bookkeeping, filings, and advisory for local businesses.', '+92-300-2200003', 'area_sector_e', 'Office Suite E-03', '{"type":"Point","coordinates":[67.0855,24.9034]}'::jsonb, true, false, false, 'verified', 'members', now(), now()),
('biz_raza_electrical', 'soc_demo_jaffar_e_tayyar', 'bcat_services', 'Raza Electrical Services', 'raza-electrical', 'Licensed residential electrical work.', 'Installations, repairs, and emergency call-outs within the society.', '+92-300-2200004', 'area_sector_e', 'Sector E service lane', '{"type":"Point","coordinates":[67.0861,24.9029]}'::jsonb, true, false, true, 'pending', 'members', now(), now()),
('biz_abbas_plumbing', 'soc_demo_jaffar_e_tayyar', 'bcat_services', 'Abbas Plumbing', 'abbas-plumbing', 'Emergency and scheduled plumbing.', 'Trusted local plumber for households and commercial units.', '+92-300-2200005', 'area_block_b2', 'Block B2 workshops', '{"type":"Point","coordinates":[67.0810,24.9066]}'::jsonb, true, false, true, 'verified', 'members', now(), now()),
('biz_corner_cafe', 'soc_demo_jaffar_e_tayyar', 'bcat_food', 'Corner Café', 'corner-cafe', 'Neighborhood café near Gate 2.', 'Tea, snacks, and light meals for residents and visitors.', '+92-300-2200006', 'area_block_a1', 'Near Gate 2', '{"type":"Point","coordinates":[67.0789,24.9089]}'::jsonb, true, true, false, 'unverified', 'members', now(), now())
ON CONFLICT (id) DO UPDATE SET
  summary = EXCLUDED.summary,
  "isHiring" = EXCLUDED."isHiring",
  verification = EXCLUDED.verification,
  "updatedAt" = now();

INSERT INTO business_owners (id, "businessId", "residentId", title, "isPrimary", "createdAt", "updatedAt") VALUES
('bo_plaza_hamza', 'biz_plaza_market', 'res_hamza_ali', 'Owner', true, now(), now()),
('bo_smile_hana', 'biz_smilecare', 'res_hana_qureshi', 'Clinic Lead', true, now(), now()),
('bo_imran_nadia', 'biz_imran_advisory', 'res_nadia_imran', 'Principal', true, now(), now()),
('bo_raza_usman', 'biz_raza_electrical', 'res_usman_raza', 'Owner', true, now(), now()),
('bo_abbas_zain', 'biz_abbas_plumbing', 'res_zain_abbas', 'Owner', true, now(), now()),
('bo_cafe_ahmed', 'biz_corner_cafe', 'res_ahmed_khan', 'Co-owner', true, now(), now())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, "updatedAt" = now();

INSERT INTO business_services (id, "businessId", name, description, "createdAt", "updatedAt") VALUES
('bsvc_plaza_grocery', 'biz_plaza_market', 'Grocery staples', 'Daily essentials and household supplies', now(), now()),
('bsvc_plaza_orders', 'biz_plaza_market', 'Home delivery', 'Same-day delivery inside society gates', now(), now()),
('bsvc_smile_checkup', 'biz_smilecare', 'Dental checkup', 'Routine oral health exams', now(), now()),
('bsvc_imran_tax', 'biz_imran_advisory', 'Tax filing', 'Individual and SME filings', now(), now()),
('bsvc_raza_wiring', 'biz_raza_electrical', 'Rewiring', 'Safe residential rewiring', now(), now()),
('bsvc_abbas_leak', 'biz_abbas_plumbing', 'Leak repair', 'Emergency leak response', now(), now()),
('bsvc_cafe_tea', 'biz_corner_cafe', 'Tea & snacks', 'Sit-in and takeaway', now(), now())
ON CONFLICT (id) DO UPDATE SET description = EXCLUDED.description, "updatedAt" = now();

COMMIT;
