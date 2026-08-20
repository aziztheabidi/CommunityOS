-- Seed residents, households, professions & skills for Jaffar-e-Tayyar Society
-- Run AFTER m2-m3-bootstrap.sql on the CommunityOS project only.
-- Safe to re-run (ON CONFLICT).

BEGIN;

-- Professional categories
INSERT INTO professional_categories (id, "societyId", key, label, "sortOrder", "createdAt", "updatedAt") VALUES
('pcat_healthcare', 'soc_demo_jaffar_e_tayyar', 'healthcare', 'Medical & Healthcare', 1, now(), now()),
('pcat_technology', 'soc_demo_jaffar_e_tayyar', 'technology', 'Technology', 2, now(), now()),
('pcat_business', 'soc_demo_jaffar_e_tayyar', 'business', 'Business', 3, now(), now()),
('pcat_education', 'soc_demo_jaffar_e_tayyar', 'education', 'Education', 4, now(), now()),
('pcat_legal', 'soc_demo_jaffar_e_tayyar', 'legal', 'Legal', 5, now(), now()),
('pcat_engineering', 'soc_demo_jaffar_e_tayyar', 'engineering', 'Engineering', 6, now(), now()),
('pcat_trades', 'soc_demo_jaffar_e_tayyar', 'trades', 'Skilled Trades', 7, now(), now())
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, "updatedAt" = now();

INSERT INTO professions (id, "societyId", "categoryId", key, label, "createdAt", "updatedAt") VALUES
('prof_doctor', 'soc_demo_jaffar_e_tayyar', 'pcat_healthcare', 'doctor', 'Doctor', now(), now()),
('prof_dentist', 'soc_demo_jaffar_e_tayyar', 'pcat_healthcare', 'dentist', 'Dentist', now(), now()),
('prof_nurse', 'soc_demo_jaffar_e_tayyar', 'pcat_healthcare', 'nurse', 'Nurse', now(), now()),
('prof_software_engineer', 'soc_demo_jaffar_e_tayyar', 'pcat_technology', 'software_engineer', 'Software Engineer', now(), now()),
('prof_product_manager', 'soc_demo_jaffar_e_tayyar', 'pcat_technology', 'product_manager', 'Product Manager', now(), now()),
('prof_designer', 'soc_demo_jaffar_e_tayyar', 'pcat_technology', 'designer', 'Designer', now(), now()),
('prof_entrepreneur', 'soc_demo_jaffar_e_tayyar', 'pcat_business', 'entrepreneur', 'Entrepreneur', now(), now()),
('prof_accountant', 'soc_demo_jaffar_e_tayyar', 'pcat_business', 'accountant', 'Accountant', now(), now()),
('prof_teacher', 'soc_demo_jaffar_e_tayyar', 'pcat_education', 'teacher', 'Teacher', now(), now()),
('prof_tutor', 'soc_demo_jaffar_e_tayyar', 'pcat_education', 'tutor', 'Tutor', now(), now()),
('prof_lawyer', 'soc_demo_jaffar_e_tayyar', 'pcat_legal', 'lawyer', 'Lawyer', now(), now()),
('prof_civil_engineer', 'soc_demo_jaffar_e_tayyar', 'pcat_engineering', 'civil_engineer', 'Civil Engineer', now(), now()),
('prof_electrician', 'soc_demo_jaffar_e_tayyar', 'pcat_trades', 'electrician', 'Electrician', now(), now()),
('prof_plumber', 'soc_demo_jaffar_e_tayyar', 'pcat_trades', 'plumber', 'Plumber', now(), now())
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, "updatedAt" = now();

INSERT INTO skills (id, "societyId", key, label, "createdAt", "updatedAt") VALUES
('skill_react', 'soc_demo_jaffar_e_tayyar', 'react', 'React', now(), now()),
('skill_nodejs', 'soc_demo_jaffar_e_tayyar', 'nodejs', 'Node.js', now(), now()),
('skill_accounting', 'soc_demo_jaffar_e_tayyar', 'accounting', 'Accounting', now(), now()),
('skill_cardiology', 'soc_demo_jaffar_e_tayyar', 'cardiology', 'Cardiology', now(), now()),
('skill_teaching', 'soc_demo_jaffar_e_tayyar', 'teaching', 'Teaching', now(), now()),
('skill_property_law', 'soc_demo_jaffar_e_tayyar', 'property_law', 'Property Law', now(), now()),
('skill_electrical', 'soc_demo_jaffar_e_tayyar', 'electrical', 'Electrical Work', now(), now()),
('skill_plumbing', 'soc_demo_jaffar_e_tayyar', 'plumbing', 'Plumbing', now(), now()),
('skill_mentoring', 'soc_demo_jaffar_e_tayyar', 'mentoring', 'Mentoring', now(), now()),
('skill_uiux', 'soc_demo_jaffar_e_tayyar', 'uiux', 'UI/UX Design', now(), now())
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, "updatedAt" = now();

-- Households linked to seeded properties
INSERT INTO households (id, "societyId", "propertyId", label, "householdSize", "moveInDate", "createdAt", "updatedAt") VALUES
('hh_a1_12', 'soc_demo_jaffar_e_tayyar', 'prop_a1_12', 'Household A1-12', 4, '2019-03-01', now(), now()),
('hh_a1_18', 'soc_demo_jaffar_e_tayyar', 'prop_a1_18', 'Household A1-18', 3, '2020-07-15', now(), now()),
('hh_b1_22', 'soc_demo_jaffar_e_tayyar', 'prop_b1_22', 'Household B1-22', 5, '2016-01-10', now(), now()),
('hh_b1_31', 'soc_demo_jaffar_e_tayyar', 'prop_b1_31', 'Household B1-31', 2, '2022-05-20', now(), now()),
('hh_d1_09', 'soc_demo_jaffar_e_tayyar', 'prop_d1_09', 'Household D1-09', 3, '2018-11-02', now(), now()),
('hh_e_03', 'soc_demo_jaffar_e_tayyar', 'prop_e_03', 'Household E-03', 4, '2021-02-14', now(), now()),
('hh_e_21', 'soc_demo_jaffar_e_tayyar', 'prop_e_21', 'Household E-21', 2, '2023-08-01', now(), now()),
('hh_d1_16', 'soc_demo_jaffar_e_tayyar', 'prop_d1_16', 'Household D1-16', 1, '2017-04-22', now(), now())
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, "householdSize" = EXCLUDED."householdSize", "updatedAt" = now();

INSERT INTO property_occupancies (id, "societyId", "propertyId", "householdId", kind, "startedAt", "createdAt", "updatedAt") VALUES
('occ_a1_12', 'soc_demo_jaffar_e_tayyar', 'prop_a1_12', 'hh_a1_12', 'owner_occupied', '2019-03-01', now(), now()),
('occ_a1_18', 'soc_demo_jaffar_e_tayyar', 'prop_a1_18', 'hh_a1_18', 'owner_occupied', '2020-07-15', now(), now()),
('occ_b1_22', 'soc_demo_jaffar_e_tayyar', 'prop_b1_22', 'hh_b1_22', 'owner_occupied', '2016-01-10', now(), now()),
('occ_b1_31', 'soc_demo_jaffar_e_tayyar', 'prop_b1_31', 'hh_b1_31', 'rented', '2022-05-20', now(), now()),
('occ_d1_09', 'soc_demo_jaffar_e_tayyar', 'prop_d1_09', 'hh_d1_09', 'owner_occupied', '2018-11-02', now(), now()),
('occ_e_03', 'soc_demo_jaffar_e_tayyar', 'prop_e_03', 'hh_e_03', 'owner_occupied', '2021-02-14', now(), now()),
('occ_e_21', 'soc_demo_jaffar_e_tayyar', 'prop_e_21', 'hh_e_21', 'rented', '2023-08-01', now(), now()),
('occ_d1_16', 'soc_demo_jaffar_e_tayyar', 'prop_d1_16', 'hh_d1_16', 'owner_occupied', '2017-04-22', now(), now())
ON CONFLICT (id) DO UPDATE SET "householdId" = EXCLUDED."householdId", "updatedAt" = now();

-- Residents
INSERT INTO residents (id, "societyId", "fullName", "preferredName", email, phone, status, "geoAreaId", headline, bio, "employmentStatus", "yearsExperience", "openToNetworking", "openToMentoring", "lookingForWork", "openToConsulting", "openToFreelance", hiring, "volunteerAvail", "profileCompleteness", "joinDate", "createdAt", "updatedAt") VALUES
('res_ahmed_khan', 'soc_demo_jaffar_e_tayyar', 'Ahmed Khan', 'Ahmed', 'ahmed.khan@example.com', '+92-300-1110001', 'active', 'area_block_a1', 'Software Engineering Manager', 'Builds community tech initiatives and mentors juniors.', 'employed', 12, true, true, false, true, false, false, true, 92, '2019-03-01', now(), now()),
('res_sara_malik', 'soc_demo_jaffar_e_tayyar', 'Sara Malik', 'Sara', 'sara.malik@example.com', '+92-300-1110002', 'active', 'area_block_a1', 'Cardiologist', 'Consultant cardiologist serving the society medical camp.', 'employed', 15, true, true, false, true, false, false, true, 88, '2019-03-01', now(), now()),
('res_bilal_hussain', 'soc_demo_jaffar_e_tayyar', 'Bilal Hussain', 'Bilal', 'bilal.hussain@example.com', '+92-300-1110003', 'active', 'area_block_a2', 'Civil Engineer', 'Infrastructure and housing society planning.', 'employed', 10, true, false, false, true, false, false, false, 80, '2020-07-15', now(), now()),
('res_fatima_zahra', 'soc_demo_jaffar_e_tayyar', 'Fatima Zahra', 'Fatima', 'fatima.zahra@example.com', '+92-300-1110004', 'active', 'area_block_b1', 'Mathematics Teacher', 'Secondary school educator and weekend tutor.', 'employed', 8, true, true, false, false, true, false, true, 85, '2016-01-10', now(), now()),
('res_omar_siddiqui', 'soc_demo_jaffar_e_tayyar', 'Omar Siddiqui', 'Omar', 'omar.siddiqui@example.com', '+92-300-1110005', 'active', 'area_block_b1', 'Property Lawyer', 'Specializes in property and society governance matters.', 'self_employed', 14, true, false, false, true, true, false, false, 90, '2016-01-10', now(), now()),
('res_aisha_rauf', 'soc_demo_jaffar_e_tayyar', 'Aisha Rauf', 'Aisha', 'aisha.rauf@example.com', '+92-300-1110006', 'active', 'area_block_b1', 'Product Designer', 'Design systems and community product UX.', 'employed', 6, true, true, false, false, true, false, false, 78, '2022-05-20', now(), now()),
('res_hamza_ali', 'soc_demo_jaffar_e_tayyar', 'Hamza Ali', 'Hamza', 'hamza.ali@example.com', '+92-300-1110007', 'active', 'area_block_d1', 'Entrepreneur · Plaza Market', 'Owns a retail business and occasionally hires part-time staff.', 'self_employed', 9, true, false, false, false, false, true, true, 84, '2018-11-02', now(), now()),
('res_nadia_imran', 'soc_demo_jaffar_e_tayyar', 'Nadia Imran', 'Nadia', 'nadia.imran@example.com', '+92-300-1110008', 'active', 'area_sector_e', 'Chartered Accountant', 'Tax and SME accounting advisory.', 'self_employed', 11, true, true, false, true, true, false, false, 87, '2021-02-14', now(), now()),
('res_usman_raza', 'soc_demo_jaffar_e_tayyar', 'Usman Raza', 'Usman', 'usman.raza@example.com', '+92-300-1110009', 'active', 'area_sector_e', 'Electrician', 'Residential electrical services within the society.', 'self_employed', 7, true, false, false, false, true, false, true, 75, '2023-08-01', now(), now()),
('res_maryam_noor', 'soc_demo_jaffar_e_tayyar', 'Maryam Noor', 'Maryam', 'maryam.noor@example.com', '+92-300-1110010', 'active', 'area_block_d1', 'Junior Developer', 'Looking for React opportunities and mentorship.', 'looking_for_work', 2, true, false, true, false, true, false, false, 70, '2017-04-22', now(), now()),
('res_zain_abbas', 'soc_demo_jaffar_e_tayyar', 'Zain Abbas', 'Zain', 'zain.abbas@example.com', '+92-300-1110011', 'active', 'area_block_b2', 'Licensed Plumber', 'Emergency and scheduled plumbing work.', 'self_employed', 13, true, false, false, false, true, false, true, 72, '2021-06-01', now(), now()),
('res_hana_qureshi', 'soc_demo_jaffar_e_tayyar', 'Hana Qureshi', 'Hana', 'hana.qureshi@example.com', '+92-300-1110012', 'active', 'area_sector_c', 'Dentist', 'Family dental care and oral health awareness.', 'employed', 9, true, true, false, false, false, false, true, 83, '2020-01-12', now(), now())
ON CONFLICT (id) DO UPDATE SET
  "fullName" = EXCLUDED."fullName",
  headline = EXCLUDED.headline,
  "employmentStatus" = EXCLUDED."employmentStatus",
  "openToMentoring" = EXCLUDED."openToMentoring",
  "lookingForWork" = EXCLUDED."lookingForWork",
  hiring = EXCLUDED.hiring,
  "updatedAt" = now();

UPDATE households SET "primaryResidentId" = 'res_ahmed_khan' WHERE id = 'hh_a1_12';
UPDATE households SET "primaryResidentId" = 'res_bilal_hussain' WHERE id = 'hh_a1_18';
UPDATE households SET "primaryResidentId" = 'res_fatima_zahra' WHERE id = 'hh_b1_22';
UPDATE households SET "primaryResidentId" = 'res_aisha_rauf' WHERE id = 'hh_b1_31';
UPDATE households SET "primaryResidentId" = 'res_hamza_ali' WHERE id = 'hh_d1_09';
UPDATE households SET "primaryResidentId" = 'res_nadia_imran' WHERE id = 'hh_e_03';
UPDATE households SET "primaryResidentId" = 'res_usman_raza' WHERE id = 'hh_e_21';
UPDATE households SET "primaryResidentId" = 'res_maryam_noor' WHERE id = 'hh_d1_16';

INSERT INTO household_members (id, "householdId", "residentId", role, "isPrimary", "createdAt", "updatedAt") VALUES
('hm_1', 'hh_a1_12', 'res_ahmed_khan', 'primary', true, now(), now()),
('hm_2', 'hh_a1_12', 'res_sara_malik', 'spouse', false, now(), now()),
('hm_3', 'hh_a1_18', 'res_bilal_hussain', 'primary', true, now(), now()),
('hm_4', 'hh_b1_22', 'res_fatima_zahra', 'primary', true, now(), now()),
('hm_5', 'hh_b1_22', 'res_omar_siddiqui', 'spouse', false, now(), now()),
('hm_6', 'hh_b1_31', 'res_aisha_rauf', 'primary', true, now(), now()),
('hm_7', 'hh_d1_09', 'res_hamza_ali', 'primary', true, now(), now()),
('hm_8', 'hh_e_03', 'res_nadia_imran', 'primary', true, now(), now()),
('hm_9', 'hh_e_21', 'res_usman_raza', 'primary', true, now(), now()),
('hm_10', 'hh_d1_16', 'res_maryam_noor', 'primary', true, now(), now())
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, "isPrimary" = EXCLUDED."isPrimary", "updatedAt" = now();

INSERT INTO resident_privacy_settings (id, "residentId", "phoneVisibility", "emailVisibility", "addressVisibility", "professionVisibility", "skillsVisibility", "createdAt", "updatedAt") VALUES
('priv_1', 'res_ahmed_khan', 'connections', 'connections', 'society_admin', 'members', 'members', now(), now()),
('priv_2', 'res_sara_malik', 'connections', 'connections', 'society_admin', 'members', 'members', now(), now()),
('priv_3', 'res_bilal_hussain', 'connections', 'members', 'society_admin', 'members', 'members', now(), now()),
('priv_4', 'res_fatima_zahra', 'connections', 'connections', 'society_admin', 'members', 'members', now(), now()),
('priv_5', 'res_omar_siddiqui', 'connections', 'connections', 'society_admin', 'public', 'members', now(), now()),
('priv_6', 'res_aisha_rauf', 'connections', 'connections', 'society_admin', 'members', 'members', now(), now()),
('priv_7', 'res_hamza_ali', 'members', 'members', 'society_admin', 'public', 'members', now(), now()),
('priv_8', 'res_nadia_imran', 'connections', 'connections', 'society_admin', 'members', 'members', now(), now()),
('priv_9', 'res_usman_raza', 'members', 'connections', 'society_admin', 'public', 'members', now(), now()),
('priv_10', 'res_maryam_noor', 'connections', 'connections', 'society_admin', 'members', 'members', now(), now()),
('priv_11', 'res_zain_abbas', 'members', 'connections', 'society_admin', 'public', 'members', now(), now()),
('priv_12', 'res_hana_qureshi', 'connections', 'connections', 'society_admin', 'members', 'members', now(), now())
ON CONFLICT ("residentId") DO UPDATE SET "professionVisibility" = EXCLUDED."professionVisibility", "updatedAt" = now();

INSERT INTO resident_professions (id, "residentId", "professionId", "isPrimary", title, "createdAt", "updatedAt") VALUES
('rp_1', 'res_ahmed_khan', 'prof_software_engineer', true, 'Engineering Manager', now(), now()),
('rp_2', 'res_sara_malik', 'prof_doctor', true, 'Cardiologist', now(), now()),
('rp_3', 'res_bilal_hussain', 'prof_civil_engineer', true, 'Civil Engineer', now(), now()),
('rp_4', 'res_fatima_zahra', 'prof_teacher', true, 'Mathematics Teacher', now(), now()),
('rp_5', 'res_omar_siddiqui', 'prof_lawyer', true, 'Property Lawyer', now(), now()),
('rp_6', 'res_aisha_rauf', 'prof_designer', true, 'Product Designer', now(), now()),
('rp_7', 'res_hamza_ali', 'prof_entrepreneur', true, 'Business Owner', now(), now()),
('rp_8', 'res_nadia_imran', 'prof_accountant', true, 'Chartered Accountant', now(), now()),
('rp_9', 'res_usman_raza', 'prof_electrician', true, 'Electrician', now(), now()),
('rp_10', 'res_maryam_noor', 'prof_software_engineer', true, 'Junior Developer', now(), now()),
('rp_11', 'res_zain_abbas', 'prof_plumber', true, 'Plumber', now(), now()),
('rp_12', 'res_hana_qureshi', 'prof_dentist', true, 'Dentist', now(), now())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, "updatedAt" = now();

INSERT INTO resident_skills (id, "residentId", "skillId", "createdAt") VALUES
('rs_1', 'res_ahmed_khan', 'skill_react', now()),
('rs_2', 'res_ahmed_khan', 'skill_nodejs', now()),
('rs_3', 'res_ahmed_khan', 'skill_mentoring', now()),
('rs_4', 'res_sara_malik', 'skill_cardiology', now()),
('rs_5', 'res_sara_malik', 'skill_mentoring', now()),
('rs_6', 'res_fatima_zahra', 'skill_teaching', now()),
('rs_7', 'res_omar_siddiqui', 'skill_property_law', now()),
('rs_8', 'res_aisha_rauf', 'skill_uiux', now()),
('rs_9', 'res_aisha_rauf', 'skill_react', now()),
('rs_10', 'res_nadia_imran', 'skill_accounting', now()),
('rs_11', 'res_usman_raza', 'skill_electrical', now()),
('rs_12', 'res_maryam_noor', 'skill_react', now()),
('rs_13', 'res_zain_abbas', 'skill_plumbing', now()),
('rs_14', 'res_hana_qureshi', 'skill_mentoring', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO employment_records (id, "residentId", employer, "jobTitle", "isCurrent", "startYear", "createdAt", "updatedAt") VALUES
('emp_1', 'res_ahmed_khan', 'Nexa Systems', 'Engineering Manager', true, 2019, now(), now()),
('emp_2', 'res_sara_malik', 'City Heart Clinic', 'Consultant Cardiologist', true, 2015, now(), now()),
('emp_3', 'res_fatima_zahra', 'Jaffar-e-Tayyar Academy', 'Mathematics Teacher', true, 2018, now(), now()),
('emp_4', 'res_aisha_rauf', 'Studio North', 'Product Designer', true, 2022, now(), now()),
('emp_5', 'res_hamza_ali', 'Plaza Market Retail', 'Owner', true, 2017, now(), now())
ON CONFLICT (id) DO UPDATE SET "jobTitle" = EXCLUDED."jobTitle", "updatedAt" = now();

-- Aggregate-only dependent age bands (no names — privacy by design)
INSERT INTO dependents (id, "societyId", "householdId", "ageBand", "educationStage", "createdAt", "updatedAt") VALUES
('dep_1', 'soc_demo_jaffar_e_tayyar', 'hh_a1_12', '5-9', 'primary', now(), now()),
('dep_2', 'soc_demo_jaffar_e_tayyar', 'hh_a1_12', '10-14', 'middle', now(), now()),
('dep_3', 'soc_demo_jaffar_e_tayyar', 'hh_b1_22', '0-4', 'preschool', now(), now()),
('dep_4', 'soc_demo_jaffar_e_tayyar', 'hh_e_03', '15-17', 'secondary', now(), now())
ON CONFLICT (id) DO UPDATE SET "ageBand" = EXCLUDED."ageBand", "updatedAt" = now();

COMMIT;
