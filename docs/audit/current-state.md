# Current State Audit — Medora Medical College Platform

> Audited: 2026-10-01 | Repository: `medora-college-platform`

---

## 1. Repository Architecture

```
medora-college-platform/         (npm monorepo — no workspace manager)
├── apps/
│   ├── api/                     NestJS API (single-file controller)
│   │   └── src/
│   │       ├── main.ts          API controller + bootstrap (648 lines)
│   │       ├── domain.ts        Core business logic (1,279 lines)
│   │       ├── learning.ts      Learning/submissions module (220 lines)
│   │       ├── database.ts      PGlite + pg Pool abstraction (72 lines)
│   │       ├── s3.ts            S3 upload/download helpers
│   │       ├── seed.ts          Demo seed data (225 lines)
│   │       ├── website-seed.ts  CMS content seed (21KB)
│   │       └── legacy-pages.ts  Hardcoded page content
│   └── web/                     Next.js 16 (App Router)
│       ├── app/
│       │   ├── page.tsx         Landing page (722 lines, client-side)
│       │   ├── workspace.tsx    Portal/dashboard (854 lines, monolith)
│       │   ├── layout.tsx       Root layout (45 lines)
│       │   ├── globals.css      Global styles (1,614 lines)
│       │   ├── landing.module.css  Landing page styles (1,280 lines)
│       │   ├── custom-select.css   Custom select styles (107 lines)
│       │   ├── resource-config.ts  Resource field/column config (383 lines)
│       │   ├── record-detail.tsx   Record detail view (17KB)
│       │   ├── record-editor.tsx   Record creation/edit (8.5KB)
│       │   ├── record-actions.tsx  Action workflows (9.3KB)
│       │   ├── workflows.tsx      Resource view orchestrator (8.8KB)
│       │   ├── import-dialog.tsx  CSV import dialog (6.3KB)
│       │   ├── role-descriptions.ts  Role explanations
│       │   ├── institution/       Public website routes
│       │   │   ├── layout.tsx     Public layout + header/footer
│       │   │   ├── page.tsx       Institution home
│       │   │   ├── website.css    Public website styles (1,149 lines)
│       │   │   ├── navigation.tsx Hardcoded nav links
│       │   │   ├── components.tsx Reusable institution UI
│       │   │   ├── content.ts     Server-side content fetcher
│       │   │   ├── [slug]/page.tsx  Dynamic content pages
│       │   │   ├── notices/page.tsx Notice board page
│       │   │   └── sitemap/page.tsx HTML sitemap
│       │   └── portal/
│       │       └── page.tsx       Just imports Workspace
│       └── public/
│           ├── favicon.svg
│           ├── images/            UI reference mockups (3 PNGs)
│           └── videos/
├── packages/
│   ├── contracts/
│   │   ├── types.ts              Generated TypeScript types
│   │   └── openapi.json          Generated OpenAPI spec (50KB)
│   └── database/
│       └── migrations/           5 SQL migration files
│           ├── 001_core.sql      Core schema (31 tables)
│           ├── 002_learning.sql  Learning resources
│           ├── 003_public_website.sql  Content extensions
│           ├── 004_authentication.sql  User auth columns
│           └── 005_s3_documents.sql    S3 migration
├── scripts/
│   ├── dev.mjs                   Dev server orchestrator
│   └── contracts.ts              OpenAPI + type generator
├── tests/                        E2E test directory
└── infra/
    └── compose.yml               Docker compose
```

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | ≥22.16 |
| Frontend | Next.js (App Router) | 16.3.6 |
| React | React | 19.2.0 |
| API | NestJS | 11.1.6 |
| Database | PGlite (dev) / PostgreSQL (prod) | 0.3.14 / pg 8.16.3 |
| State | TanStack Query | 5.90.2 |
| Forms | React Hook Form + Zod 4 | 7.63.0 / 4.1.11 |
| Icons | Lucide React | 0.544.0 |
| Notifications | react-hot-toast | 2.6.1 |
| File Storage | AWS S3 | SDK v3 |
| Email | Nodemailer | 10.0.12 |
| Auth | bcrypt + custom sessions | cookie-based |
| Styling | **Custom CSS / CSS Modules** | — |
| UI Library | **NONE** | — |

**Key finding: No MUI or any component library is installed.**

---

## 3. Existing Route Map

### Public Website (`/institution/*`)
| Route | Type | Exists | Data Source |
|-------|------|--------|-------------|
| `/institution` | SSR | ✅ | `publicContent` API |
| `/institution/[slug]` | SSR | ✅ | `publicContent` API |
| `/institution/notices` | SSR | ✅ | `publicContent` API |
| `/institution/sitemap` | SSR | ✅ | `publicContent` API |

### Management Portal (`/portal`)
| Route | Type | Exists |
|-------|------|--------|
| `/portal` | Client | ✅ |

The portal is a **single-page application** at `/portal`. All resource views (students, sessions, invoices, etc.) are rendered by `workspace.tsx` using URL search params (`?view=students`), NOT distinct Next.js routes.

### Landing Page (`/`)
| Route | Type | Exists |
|-------|------|--------|
| `/` | Client | ✅ |

Fully client-rendered landing page with hardcoded content, animations, testimonials.

### SEO/Utility
| Route | Exists |
|-------|--------|
| `/sitemap.xml` | ✅ |
| `/robots.txt` | ✅ |

---

## 4. Existing Database Entity Map

### Core Schema (001_core.sql) — 26 tables + 4 indexes

| Table | Purpose | Tenant-scoped |
|-------|---------|---------------|
| `institutions` | Multi-tenant root | N/A |
| `users` | All user identities + auth | ✅ |
| `auth_sessions` | Cookie sessions | ✅ (via user) |
| `masters` | Reference data (depts, programmes, batches) | ✅ |
| `policies` | Attendance/Academic/Fee policies | ✅ |
| `students` | Student records | ✅ |
| `seat_pools` | Admission seat capacity | ✅ |
| `applications` | Admission applications | ✅ |
| `competencies` | Curriculum learning outcomes | ✅ |
| `teaching_sessions` | Timetable sessions | ✅ |
| `attendance` | Per-session attendance | ✅ |
| `corrections` | Attendance amendments | ✅ |
| `assessments` | Exams/assessments | ✅ |
| `marks` | Score records | ✅ |
| `logbook` | Clinical/learning evidence | ✅ |
| `invoices` | Fee invoices | ✅ |
| `payments` | Payment records | ✅ |
| `refunds` | Refund requests | ✅ |
| `content` | CMS pages/notices/events | ✅ |
| `tickets` | Support/grievance tickets | ✅ |
| `notices` | Internal notices | ✅ |
| `documents` | Uploaded files (S3) | ✅ |
| `evidence` | Academic evidence packs | ✅ |
| `audit` | Audit trail | ✅ |
| `outbox` | Event outbox | ✅ |
| `idempotency` | Idempotency keys | ✅ |

### Learning Schema (002_learning.sql) — 3 tables

| Table | Purpose |
|-------|---------|
| `learning_resources` | Faculty-created resources/assignments |
| `learning_submissions` | Student assignment submissions |
| `service_requests` | Certificate/leave/appeal requests |

### Support Tables

| Table | Source |
|-------|--------|
| `schema_migrations` | Database module |
| `demo_fixture_versions` | 003_public_website.sql |

**Total: ~31 tables**

---

## 5. Existing API Module Map

### Authentication (in `main.ts`)
| Endpoint | Method | Auth |
|----------|--------|------|
| `GET /api/v1/health` | — | Public |
| `GET /api/v1/public/institutions` | — | Public |
| `GET /api/v1/auth/demo-users` | — | Dev only |
| `POST /api/v1/auth/demo-login` | — | Public |
| `POST /api/v1/auth/signup` | — | Public |
| `POST /api/v1/auth/verify-email` | — | Public |
| `POST /api/v1/auth/login` | — | Public |
| `POST /api/v1/auth/logout` | — | Session |
| `POST /api/v1/auth/invite` | — | Unchecked |
| `POST /api/v1/auth/setup-password` | — | Token |
| `POST /api/v1/auth/forgot-password` | — | Public |
| `POST /api/v1/auth/reset-password` | — | Token |
| `GET /api/v1/auth/me` | — | Session |

### Core CRUD (Generic in `domain.ts`)
| Endpoint | Resources |
|----------|-----------|
| `GET /api/v1/:resource` | List with pagination, search, status filter |
| `GET /api/v1/:resource/:id` | Detail with related data |
| `POST /api/v1/:resource` | Create with Zod validation |
| `POST /api/v1/:resource/:id/:action` | State transitions (workflow) |

### Special Endpoints
| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/dashboard` | Role-aware dashboard stats |
| `GET /api/v1/options` | Form dropdowns (people, competencies, depts) |
| `POST /api/v1/applications/import` | CSV bulk import |
| `GET /api/v1/attendance-summary` | Student attendance breakdown |
| `GET /api/v1/public/content` | Public CMS content |
| `POST /api/v1/public/enquiry` | Contact form |
| `GET /api/v1/documents/:id/download` | S3 presigned download |
| `GET /api/v1/evidence/:id/download` | Evidence manifest |

---

## 6. Existing RBAC Map

**10 roles defined in seed:**
`admin`, `registrar`, `faculty`, `dean`, `finance`, `student`, `editor`, `publisher`, `committee`, `auditor`

**Authorization model:** Role-based array checks per resource (not granular permissions).

```
authorize(a, ['registrar']) // Simple role-in-array check
```

**No granular permission system** (e.g., `students.read`, `students.export`). Just `readRoles` and `writeRoles` maps.

---

## 7. Existing CMS Map

- **Content model:** Single `content` table with `kind` field (`Page`, `Notice`, `Event`, `Disclosure`)
- **Publication workflow:** `Draft → In review → Published → Archived` with `Returned` branch
- **Separation of duties:** Editor creates, Publisher approves (self-publish blocked)
- **Bilingual:** `en` and `bn` language support
- **Publication scheduling:** `available_on` / `archive_on` date fields
- **Category system:** 8 categories for notices
- **Public rendering:** Server-side via `/institution/[slug]` with API fetch

**Missing CMS features:**
- No homepage section builder
- No media library (documents exist but not CMS media)
- No navigation manager (hardcoded in `navigation.tsx`)
- No branding/theme manager
- No SEO manager per page
- No content blocks/rich editor
- No doctor/department/facility collections

---

## 8. Existing Student Map

- **Student table:** Basic fields (id, number, name, email, programme, batch, department, status)
- **Creation:** Only via admission workflow (application → verify → approve → enroll)
- **Student list:** Generic resource list in `workspace.tsx`
- **Student detail:** Generic record detail in `record-detail.tsx`
- **No student dashboard** with KPIs
- **No student profile** with tabbed layout
- **No student portal** (separate experience)
- **No multi-step admission wizard**
- **Attendance:** Via teaching sessions, with attendance summary endpoint
- **Fees:** Invoice/payment/refund cycle exists

---

## 9. CSS Architecture

| File | Lines | Size | Scope |
|------|-------|------|-------|
| `globals.css` | 1,614 | 27KB | Portal UI (sidebar, tables, forms, modals, dashboard) |
| `landing.module.css` | 1,280 | 26KB | Landing page (CSS Module) |
| `website.css` | 1,149 | 23KB | Public institution website |
| `custom-select.css` | 107 | 2.2KB | Custom select component |
| **Total** | **4,150** | **~78KB** | — |

**All styling is custom CSS with no component library.** This is 4,150 lines of hand-written CSS that would need to be migrated to MUI's theming system.

---

## 10. Key Architectural Observations

### Strengths
1. **Solid domain model** — Comprehensive business logic with proper validation, state machines, and audit trails
2. **Multi-tenant architecture** — `institution_id` scoping on every table
3. **Role-based access** — 10 distinct roles with read/write separation
4. **Idempotency** — Critical financial operations have idempotency keys
5. **Audit logging** — Every mutation is audit-logged
6. **CSRF protection** — Double-submit cookie pattern
7. **Rate limiting** — Per-IP bucket rate limits
8. **Publication workflow** — Proper editorial review pipeline
9. **Security headers** — CSP, HSTS, X-Frame-Options all configured
10. **Contract generation** — OpenAPI spec and TypeScript types auto-generated

### Concerns
1. **Monolithic frontend** — `workspace.tsx` (854 lines) renders ALL portal views; not modular
2. **No component library** — 4,150 lines of custom CSS = maintenance burden
3. **No separate routes** — Portal uses search params (`?view=students`), not App Router routes
4. **Hardcoded landing page** — 722 lines of hardcoded content in `page.tsx`
5. **Hardcoded navigation** — `navigation.tsx` has static link array
6. **Generic UI** — All resources share the same table/detail/editor components
7. **No student-specific UI** — No dashboard, profile tabs, or dedicated student pages
8. **No hospital module** — Zero hospital management (OPD, IPD, pharmacy, etc.)
9. **Simple RBAC** — Role arrays, not granular permission system
10. **Single-file API controller** — Everything in `main.ts` (648 lines)
