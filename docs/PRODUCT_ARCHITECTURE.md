# Product Architecture

## 1. Platform hierarchy

```
Platform
  └── Society (tenant)
        ├── Society Settings / Taxonomies / Roles
        ├── Geographic Areas (configurable levels)
        │     Phase → Sector → Block → Street → Plot → Property
        ├── Properties → Occupancies → Households → Members
        ├── Residents (linked to platform users when onboarded)
        ├── Professions / Skills / Employment / Education
        ├── Businesses & Services
        ├── Connections / Follows / Groups
        ├── Feed / Announcements / Events / Opportunities
        ├── Messaging / Notifications
        ├── GIS Features & Boundaries
        └── Analytics Events / Snapshots
```

Multi-society SaaS is a first-class architectural constraint even if v1 serves one society.

## 2. Domain model (logical)

### Core identity & tenancy

- **PlatformUser** — auth identity (Supabase user)  
- **Society** — tenant  
- **SocietyMembership** — user ↔ society with roles/permissions  
- **Resident** — person record within a society (may exist before login)  

### Geography

- **GeoArea** — polymorphic configurable level (phase/sector/block/custom) with optional parent  
- **Street / Plot** — optional linear/parcel entities  
- **Property** — addressable unit with geometry  
- **GeoBoundary / GeoFeature** — PostGIS polygons/points for map layers & amenities  

### Households

- **PropertyOccupancy** — time-bounded occupancy of a property (owner/tenant/history)  
- **Household** — living unit within an occupancy  
- **HouseholdMember** — resident ↔ household with relationship role  
- **Dependent** — minor/dependent record; stronger privacy defaults  

### Professional graph

- **ProfessionCategory / Profession / Industry / Skill / Certification** — admin-managed taxonomies  
- **ResidentProfession**, **ResidentSkill**, **ResidentInterest**  
- **EmploymentRecord**, **EducationRecord**  
- **ProfessionalIntent** flags (open to mentoring, hiring, looking for work, etc.)  

### Business graph

- **Business**, **BusinessCategory**, **BusinessService**  
- **BusinessOwner / BusinessStaff** — many residents per business  
- Recommendations / verification / resident discounts (phased)  

### Community graph

- **Connection / ConnectionRequest / Follow** (distinct)  
- **Group / GroupMember**  
- **Post / Comment / Reaction / Poll**  
- **Announcement** (targeted audiences)  
- **Event / EventAttendee**  
- **Opportunity / OpportunityApplication**  
- **Conversation / Message**  
- **Notification**  
- **Achievement**  

### Privacy & governance

- **ResidentPrivacySettings** (field visibility)  
- **ConsentRecord**  
- **AuditLog**  
- **Report / ModerationAction**  
- **SavedSearch**  

### Intelligence

- **AnalyticsEvent**, **AnalyticsSnapshot**  
- Pre-aggregated profession/geo counts respecting privacy thresholds  

## 3. Community Graph

Edges (examples):

| From | To | Edge |
|------|----|------|
| Resident | Household/Property/GeoArea | lives_in |
| Resident | Profession/Skill | has |
| Resident | Business | owns / works_at |
| Resident | Resident | connected / follows |
| Resident | Group/Event/Opportunity | member / attendee / applicant |
| Business | GeoFeature | located_at |
| SearchQuery | Skill/Profession | demand_signal (analytics) |

Query surfaces (directories, map, intelligence) read through a **visibility projection** layer—never raw joins of sensitive columns.

## 4. Module boundaries

| Module | Owns | Must not own |
|--------|------|--------------|
| `societies` | Tenant, settings, membership | Resident PII details |
| `geography` | Areas, boundaries, features | Profession stats |
| `properties` | Properties, plots, streets | Household PII |
| `households` | Households, occupancy, members | Map rendering |
| `residents` | Profiles, contacts, privacy prefs | Feed algorithms |
| `professions` | Taxonomies, resident professions | Business CRUD |
| `employment` | Employment/education history | Auth |
| `businesses` | Business graph | Messaging |
| `skills` | Skills/interests taxonomies | GIS |
| `connections` | Connections/follows/discovery rules | Posts |
| `feed` | Posts/comments/reactions/polls | Exact addresses |
| `events` | Events/RSVP | Chat transport |
| `opportunities` | Jobs/mentoring/volunteer | Payments (future) |
| `groups` | Groups/membership | Global search index |
| `messaging` | Conversations/messages | Analytics rollups |
| `notifications` | Notification fanout prefs | Source domain writes |
| `search` | Indexing abstraction & query API | Authorization policy definition |
| `discovery` | Deterministic recommendations | ML training (future) |
| `moderation` | Reports/actions | Tenant billing |
| `analytics` | Events, snapshots, intelligence APIs | Direct UI charts without privacy gates |
| `permissions` | Permission catalog & evaluators | Domain persistence |

Cross-module calls go through explicit service interfaces; avoid circular imports.

## 5. Major product areas (UX ↔ domain)

1. **Home / Intelligence Dashboard** — analytics + map teaser + quick actions  
2. **Society Map** — signature GIS experience  
3. **Residents / Member Directory** — grid/list/map  
4. **Professionals / Talent Directory** — category-first discovery  
5. **Businesses** — directory + map pins  
6. **Network** — connections, follows, discovery  
7. **Feed** — social + announcements  
8. **Events / Groups / Opportunities**  
9. **Messages / Notifications**  
10. **Admin** — geography, imports, taxonomies, roles, audit, moderation  

## 6. Configurable geography

Societies differ (Phase/Sector/Block vs Tower/Floor). Model:

- Ordered **geo level definitions** per society  
- **GeoArea** nodes with `level_key`, `parent_id`, optional geometry  
- Properties attach to the leaf-most relevant area + optional street/plot  

## 7. Non-goals for early milestones

- AI natural-language search as MVP dependency  
- Microservices  
- Public internet-wide people search  
- Unrestricted admin bulk PII export  
- Treating children as searchable members  

## 8. Evolution path

Deterministic search & recommendations → embedding/semantic search behind the same abstraction → Community Assistant that **must** call authorization-filtered retrieval APIs.
