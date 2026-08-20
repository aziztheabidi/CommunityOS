-- Seed network, feed, events, opportunities for Jaffar-e-Tayyar
-- Run AFTER residents seed + m5-m9-bootstrap.sql

BEGIN;

INSERT INTO connections (id, "societyId", "fromResidentId", "toResidentId", status, message, "createdAt", "updatedAt") VALUES
('conn_ahmed_sara', 'soc_demo_jaffar_e_tayyar', 'res_ahmed_khan', 'res_sara_malik', 'accepted', 'Household + community partners', now(), now()),
('conn_ahmed_maryam', 'soc_demo_jaffar_e_tayyar', 'res_ahmed_khan', 'res_maryam_noor', 'accepted', 'Mentoring React', now(), now()),
('conn_fatima_aisha', 'soc_demo_jaffar_e_tayyar', 'res_fatima_zahra', 'res_aisha_rauf', 'accepted', 'Education × design collab', now(), now()),
('conn_nadia_hamza', 'soc_demo_jaffar_e_tayyar', 'res_nadia_imran', 'res_hamza_ali', 'accepted', 'SME accounting support', now(), now()),
('conn_omar_bilal', 'soc_demo_jaffar_e_tayyar', 'res_omar_siddiqui', 'res_bilal_hussain', 'accepted', 'Property governance', now(), now()),
('conn_usman_zain', 'soc_demo_jaffar_e_tayyar', 'res_usman_raza', 'res_zain_abbas', 'accepted', 'Trades referral network', now(), now()),
('conn_hana_sara', 'soc_demo_jaffar_e_tayyar', 'res_hana_qureshi', 'res_sara_malik', 'accepted', 'Health camp partners', now(), now()),
('conn_maryam_aisha', 'soc_demo_jaffar_e_tayyar', 'res_maryam_noor', 'res_aisha_rauf', 'pending', 'Would love design mentorship', now(), now())
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, "updatedAt" = now();

INSERT INTO posts (id, "societyId", "authorId", kind, body, "geoAreaId", "isPinned", "createdAt", "updatedAt") VALUES
('post_medical_camp', 'soc_demo_jaffar_e_tayyar', 'res_sara_malik', 'announcement', 'Free cardiology screening this Saturday at the Community Center, 10am–1pm. Residents welcome; bring prior reports if available.', 'area_block_a1', true, now() - interval '2 days', now()),
('post_react_help', 'soc_demo_jaffar_e_tayyar', 'res_maryam_noor', 'question', 'Anyone free for a quick React code review this week? Looking for junior-friendly feedback on a small portfolio project.', 'area_block_d1', false, now() - interval '1 day', now()),
('post_plaza_hire', 'soc_demo_jaffar_e_tayyar', 'res_hamza_ali', 'opportunity_share', 'Plaza Market is hiring a part-time evening helper (3 evenings/week). Prefer residents who can start next Monday.', 'area_block_d1', false, now() - interval '18 hours', now()),
('post_park_cleanup', 'soc_demo_jaffar_e_tayyar', 'res_fatima_zahra', 'update', 'Sector B weekend park cleanup was a success — thanks to the 14 neighbors who showed up. Next session in two weeks.', 'area_block_b1', false, now() - interval '8 hours', now()),
('post_tax_clinic', 'soc_demo_jaffar_e_tayyar', 'res_nadia_imran', 'announcement', 'Hosting a free SME tax Q&A next Thursday evening at Office Suite E-03. Limited to 12 slots.', 'area_sector_e', false, now() - interval '4 hours', now()),
('post_electrical_tip', 'soc_demo_jaffar_e_tayyar', 'res_usman_raza', 'update', 'Monsoon tip: if your outdoor junction boxes look damp, message me — I can do a quick safety check for society residents.', 'area_sector_e', false, now() - interval '2 hours', now())
ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body, "updatedAt" = now();

INSERT INTO reactions (id, "postId", "residentId", emoji, "createdAt") VALUES
('rx_1', 'post_medical_camp', 'res_ahmed_khan', '👍', now()),
('rx_2', 'post_medical_camp', 'res_hana_qureshi', '❤️', now()),
('rx_3', 'post_react_help', 'res_ahmed_khan', '👍', now()),
('rx_4', 'post_react_help', 'res_aisha_rauf', '🙌', now()),
('rx_5', 'post_plaza_hire', 'res_nadia_imran', '👍', now()),
('rx_6', 'post_park_cleanup', 'res_omar_siddiqui', '👏', now()),
('rx_7', 'post_tax_clinic', 'res_hamza_ali', '👍', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO comments (id, "postId", "authorId", body, "createdAt", "updatedAt") VALUES
('cmt_1', 'post_react_help', 'res_ahmed_khan', 'Happy to review Friday evening — ping me.', now() - interval '20 hours', now()),
('cmt_2', 'post_medical_camp', 'res_hana_qureshi', 'I can bring dental hygiene kits for the kids corner.', now() - interval '1 day', now()),
('cmt_3', 'post_plaza_hire', 'res_maryam_noor', 'Sharing with a neighbor looking for evening work.', now() - interval '10 hours', now())
ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body, "updatedAt" = now();

INSERT INTO events (id, "societyId", "hostId", title, summary, description, "locationName", "geoAreaId", "geomJson", "startsAt", "endsAt", capacity, "isPublic", "createdAt", "updatedAt") VALUES
('evt_medical_camp', 'soc_demo_jaffar_e_tayyar', 'res_sara_malik', 'Cardiology Screening Camp', 'Free resident health screening', 'Walk-in cardiology checks with triage and referrals.', 'Community Center Hall', 'area_block_a1', '{"type":"Point","coordinates":[67.197885,24.88246]}'::jsonb, now() + interval '3 days', now() + interval '3 days' + interval '3 hours', 80, true, now(), now()),
('evt_tax_clinic', 'soc_demo_jaffar_e_tayyar', 'res_nadia_imran', 'SME Tax Q&A', 'Evening clinic for local business owners', 'Bring questions on filings, invoices, and payroll basics.', 'Office Suite E-03', 'area_sector_e', '{"type":"Point","coordinates":[67.208885,24.88046]}'::jsonb, now() + interval '6 days', now() + interval '6 days' + interval '2 hours', 12, true, now(), now()),
('evt_park_cleanup', 'soc_demo_jaffar_e_tayyar', 'res_fatima_zahra', 'Sector B Park Cleanup', 'Volunteer morning cleanup', 'Gloves and bags provided. Families welcome.', 'Sector B Central Park', 'area_block_b1', '{"type":"Point","coordinates":[67.194885,24.88746]}'::jsonb, now() + interval '10 days', now() + interval '10 days' + interval '2 hours', 40, true, now(), now()),
('evt_youth_coding', 'soc_demo_jaffar_e_tayyar', 'res_ahmed_khan', 'Youth Coding Meetup', 'Intro React session for teens', 'Bring a laptop. Mentors from the society tech circle.', 'School Lab · Sector C', 'area_sector_c', '{"type":"Point","coordinates":[67.187885,24.89146]}'::jsonb, now() + interval '14 days', now() + interval '14 days' + interval '2 hours', 25, true, now(), now()),
('evt_trades_fair', 'soc_demo_jaffar_e_tayyar', 'res_usman_raza', 'Trades & Home Services Fair', 'Meet local electricians, plumbers, and contractors', 'Open booths near Gate 2 plaza.', 'Near Gate 2', 'area_block_a1', '{"type":"Point","coordinates":[67.192885,24.87626]}'::jsonb, now() + interval '21 days', now() + interval '21 days' + interval '4 hours', 100, true, now(), now()),
('evt_dental_day', 'soc_demo_jaffar_e_tayyar', 'res_hana_qureshi', 'Family Dental Awareness Day', 'Oral health tips and free checkups', 'Priority for households with children.', 'SmileCare Dental', 'area_sector_c', '{"type":"Point","coordinates":[67.190885,24.88046]}'::jsonb, now() + interval '28 days', now() + interval '28 days' + interval '3 hours', 30, true, now(), now())
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, "geomJson" = EXCLUDED."geomJson", "startsAt" = EXCLUDED."startsAt", "updatedAt" = now();

INSERT INTO event_rsvps (id, "eventId", "residentId", status, "createdAt", "updatedAt") VALUES
('rsvp_1', 'evt_medical_camp', 'res_ahmed_khan', 'going', now(), now()),
('rsvp_2', 'evt_medical_camp', 'res_hana_qureshi', 'going', now(), now()),
('rsvp_3', 'evt_tax_clinic', 'res_hamza_ali', 'going', now(), now()),
('rsvp_4', 'evt_tax_clinic', 'res_bilal_hussain', 'interested', now(), now()),
('rsvp_5', 'evt_park_cleanup', 'res_omar_siddiqui', 'going', now(), now()),
('rsvp_6', 'evt_youth_coding', 'res_maryam_noor', 'going', now(), now()),
('rsvp_7', 'evt_youth_coding', 'res_aisha_rauf', 'going', now(), now()),
('rsvp_8', 'evt_trades_fair', 'res_zain_abbas', 'going', now(), now())
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, "updatedAt" = now();

INSERT INTO opportunities (id, "societyId", "posterId", kind, status, title, summary, description, "geoAreaId", "isRemoteOk", compensation, "createdAt", "updatedAt", "closesAt") VALUES
('opp_plaza_helper', 'soc_demo_jaffar_e_tayyar', 'res_hamza_ali', 'job', 'open', 'Part-time Plaza Market Helper', 'Evening retail support 3 days/week', 'Stocking, customer help, and closing checklist. Prefer society residents.', 'area_block_d1', false, 'PKR stipend · evenings', now(), now(), now() + interval '21 days'),
('opp_react_junior', 'soc_demo_jaffar_e_tayyar', 'res_ahmed_khan', 'freelance', 'open', 'Junior React Assist', 'Short freelance UI polish for a community tool', 'Help refine forms and empty states. Mentorship included.', 'area_block_a1', true, 'Paid micro-project', now(), now(), now() + interval '30 days'),
('opp_math_tutor', 'soc_demo_jaffar_e_tayyar', 'res_fatima_zahra', 'freelance', 'open', 'Weekend Math Tutor', 'Secondary school tutoring', 'Two weekend slots open for Sector B/C students.', 'area_block_b1', false, 'Hourly', now(), now(), now() + interval '45 days'),
('opp_mentorship_design', 'soc_demo_jaffar_e_tayyar', 'res_aisha_rauf', 'mentorship', 'open', 'Product Design Mentorship', 'Portfolio reviews for aspiring designers', 'Monthly 1:1 sessions for residents exploring UX careers.', 'area_block_b1', true, 'Volunteer mentorship', now(), now(), now() + interval '60 days'),
('opp_volunteer_camp', 'soc_demo_jaffar_e_tayyar', 'res_sara_malik', 'volunteer', 'open', 'Medical Camp Volunteers', 'Registration desk + crowd flow', 'Need 6 friendly volunteers for Saturday screening camp.', 'area_block_a1', false, 'Volunteer', now(), now(), now() + interval '5 days'),
('opp_electrical_apprentice', 'soc_demo_jaffar_e_tayyar', 'res_usman_raza', 'internship', 'open', 'Electrical Apprentice Shadow', 'Learn residential electrical safety', 'Shadow on society jobs for 2 weekends. Tools provided.', 'area_sector_e', false, 'Unpaid learning + stipend for travel', now(), now(), now() + interval '40 days')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, summary = EXCLUDED.summary, "updatedAt" = now();

INSERT INTO opportunity_applications (id, "opportunityId", "residentId", message, status, "createdAt", "updatedAt") VALUES
('app_1', 'opp_react_junior', 'res_maryam_noor', 'I have a small React portfolio and would love the mentorship.', 'submitted', now(), now()),
('app_2', 'opp_volunteer_camp', 'res_ahmed_khan', 'Can help with registration desk.', 'submitted', now(), now()),
('app_3', 'opp_mentorship_design', 'res_maryam_noor', 'Interested in design fundamentals alongside coding.', 'submitted', now(), now())
ON CONFLICT (id) DO UPDATE SET message = EXCLUDED.message, "updatedAt" = now();

COMMIT;
