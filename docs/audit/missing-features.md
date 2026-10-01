# Missing Features Matrix — Medora Medical College Platform

> Compared against: `MCMS-STUDENT-CMS-MUI-MIGRATION-SKILL.md` (34 sections)

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Exists and functional |
| ⚠️ | Partially exists (incomplete or generic) |
| ❌ | Missing entirely |

---

## 1. UI Library (Skill §2)

| Requirement | Status | Notes |
|-------------|--------|-------|
| MUI Material installed | ❌ | Not in `package.json` |
| Emotion React/Styled | ❌ | Not installed |
| MUI DataGrid | ❌ | Not installed |
| MUI Date Pickers | ❌ | Not installed |
| MUI Icons | ❌ | Using Lucide instead |
| MUI App Router integration | ❌ | No `@mui/material-nextjs` |
| MUI Theme provider | ❌ | No theme file |
| Design tokens in MUI | ❌ | All in CSS variables |

---

## 2. Design System (Skill §3)

| Requirement | Status | Notes |
|-------------|--------|-------|
| Clinical Teal palette | ⚠️ | `--teal: #0f766e` exists in CSS vars |
| Navy palette | ⚠️ | `--navy: #102a43` exists |
| Accent colors (Mint, Gold) | ❌ | Not defined |
| MUI Theme with design tokens | ❌ | CSS variables only |
| Responsive breakpoints (MUI) | ❌ | Media queries in CSS |
| Consistent component variants | ❌ | Ad-hoc CSS per component |

---

## 3. Student Module (Skill §4–9)

| Feature | Status | Notes |
|---------|--------|-------|
| **Student Dashboard** (`/students`) | ❌ | No dashboard with KPIs |
| Total/Active/Graduated/Leave stats | ❌ | Only generic `dashboard` endpoint |
| Course/Dept/Batch distribution | ❌ | No distribution charts |
| Attendance/Fee/Exam summaries | ⚠️ | `attendance-summary` API exists |
| **Student List** (`/students/list`) | ⚠️ | Generic resource table, no MUI DataGrid |
| Server-side search | ⚠️ | Basic ILIKE on `name` only |
| Multi-filter (course/dept/batch/year) | ❌ | Only status filter |
| Column visibility | ❌ | Fixed columns |
| Export | ❌ | No export functionality |
| Bulk actions | ❌ | No bulk operations |
| **Student Admission Wizard** (`/students/new`) | ❌ | No multi-step stepper |
| MUI Stepper for admission | ❌ | Create via application workflow only |
| 13-step form flow | ❌ | Generic record editor |
| **Student Profile** (`/students/[id]`) | ⚠️ | Generic record detail, no tabs |
| Profile header with photo | ❌ | Text-only detail view |
| Overview tab | ⚠️ | Flat record display |
| Academic tab | ❌ | No academic history |
| Attendance tab | ⚠️ | Separate attendance summary endpoint |
| Examination tab | ⚠️ | Assessment list exists |
| Fees tab | ⚠️ | Invoice list exists |
| Clinical Training tab | ⚠️ | Logbook exists |
| Hostel tab | ❌ | No hostel module |
| Documents tab | ⚠️ | Documents exist but not student-linked UI |
| Communication tab | ⚠️ | Notices exist |
| Audit tab | ⚠️ | Audit table exists |
| **Student Actions** | ⚠️ | Limited to status view |
| Promote/Transfer/Change batch | ❌ | No action endpoints |
| Print ID / Generate certificate | ❌ | No print/export |
| **Student Portal** (`/student-portal`) | ❌ | No separate student-facing portal |

---

## 4. Faculty Portal (Skill §10)

| Feature | Status | Notes |
|---------|--------|-------|
| Dedicated faculty portal | ❌ | Uses same generic workspace |
| Faculty dashboard | ❌ | Generic dashboard |
| Assigned subjects view | ⚠️ | Sessions filtered by faculty |
| Marks entry UI | ⚠️ | Generic action dialog |
| Clinical supervision | ⚠️ | Logbook review exists |

---

## 5. CMS / Public Website (Skill §11–19)

| Feature | Status | Notes |
|---------|--------|-------|
| **Dynamic public homepage** | ⚠️ | `/institution` exists but sections are static |
| Homepage section builder | ❌ | No admin control |
| Section enable/disable/reorder | ❌ | Hardcoded layout |
| **CMS Page Manager** | ⚠️ | `content` CRUD exists |
| Rich content editor | ❌ | Plain textarea |
| Page preview | ❌ | No preview mode |
| Revision history | ❌ | Version number only |
| **Content Collections** | ⚠️ | Only `content` table with `kind` field |
| Departments collection | ❌ | Hardcoded in frontend |
| Doctors collection | ❌ | Not modeled |
| Courses collection | ❌ | Not modeled |
| Services collection | ❌ | Not modeled |
| Facilities collection | ❌ | Not modeled |
| News/Events collection | ⚠️ | `Event` kind in content |
| FAQ collection | ❌ | Not modeled |
| Testimonials collection | ❌ | Hardcoded in landing page |
| Gallery collection | ❌ | Not modeled |
| Careers collection | ❌ | Not modeled |
| **Media Library** | ❌ | Documents exist but no media library UI |
| Upload/search/filter/preview | ❌ | — |
| Folder/category organization | ❌ | — |
| Usage tracking | ❌ | — |
| **Branding Manager** | ❌ | Hardcoded brand in layout |
| Logo/favicon management | ❌ | Static files |
| Color/typography config | ❌ | CSS variables |
| **Navigation Manager** | ❌ | `navigation.tsx` is hardcoded array |
| Dynamic menu builder | ❌ | — |
| **SEO Manager** | ⚠️ | Basic metadata in layouts |
| Per-page SEO fields | ❌ | No admin UI for SEO |
| Dynamic sitemap | ⚠️ | `/sitemap.xml` exists but basic |
| Structured data | ⚠️ | JSON-LD in institution layout |
| **Publishing Workflow** | ✅ | Draft → In review → Published → Archived |

---

## 6. Hospital Management (Skill §20)

| Feature | Status | Notes |
|---------|--------|-------|
| Hospital Dashboard | ❌ | — |
| Patient Management | ❌ | — |
| Patient Profile | ❌ | — |
| OPD | ❌ | — |
| Appointments | ❌ | — |
| IPD/Ward | ❌ | — |
| Bed Management | ❌ | — |
| Nursing | ❌ | — |
| Emergency | ❌ | — |
| Laboratory | ❌ | — |
| Radiology | ❌ | — |
| Pharmacy | ❌ | — |
| Prescription | ❌ | — |
| Operation Theatre | ❌ | — |
| Blood Bank | ❌ | — |
| Inventory | ❌ | — |
| Billing | ❌ | — |
| Finance | ⚠️ | Invoice/payment exists |
| Reports | ❌ | — |

**Hospital module is completely absent.** Only `masters.kind = 'Hospital'` exists as a placeholder.

---

## 7. Academic Module (Skill §21)

| Feature | Status | Notes |
|---------|--------|-------|
| Academic Dashboard | ❌ | No dedicated dashboard |
| Department management | ⚠️ | Masters table with `kind='Department'` |
| Programs/Courses | ⚠️ | Masters table with `kind='Programme'` |
| Subjects | ⚠️ | Competencies table |
| Curriculum | ⚠️ | Competencies with version |
| Academic Years | ⚠️ | Batches in masters |
| Timetable | ⚠️ | Teaching sessions |
| Attendance | ✅ | Full workflow with corrections |
| Examination | ✅ | Full moderation + publication workflow |
| Results | ⚠️ | Published assessments = results |
| Promotion | ❌ | No promotion workflow |
| Academic Calendar | ❌ | No calendar view |

---

## 8. Examination Module (Skill §22)

| Feature | Status | Notes |
|---------|--------|-------|
| Exam dashboard | ❌ | — |
| Exam schedule | ⚠️ | No dedicated schedule view |
| Exam creation | ✅ | Assessment CRUD |
| Marks entry | ✅ | `save-marks` action |
| Results moderation | ✅ | `moderate` → `publish` workflow |
| Admit cards | ❌ | — |
| Exam halls/Seating | ❌ | — |
| Internal assessment | ⚠️ | Single assessment type |
| Grade rules | ❌ | — |
| Backlogs | ❌ | — |
| Revaluation | ❌ | — |

---

## 9. Finance Module (Skill §23)

| Feature | Status | Notes |
|---------|--------|-------|
| Finance dashboard | ❌ | — |
| Fee structures | ⚠️ | `fee_version` field, no structure table |
| Student invoices | ✅ | Full CRUD |
| Payments | ✅ | Record payment workflow |
| Refunds | ✅ | Two-party approval workflow |
| Scholarships | ❌ | — |
| Discounts | ❌ | — |
| Expenses | ❌ | — |
| Revenue reports | ❌ | — |
| Tax/GST | ❌ | — |
| Receipts | ❌ | No PDF receipt generation |

---

## 10. Reports Module (Skill §24)

| Feature | Status | Notes |
|---------|--------|-------|
| Central reporting system | ❌ | No reporting module at all |
| Any report with filters/export | ❌ | — |

---

## 11. RBAC (Skill §25)

| Feature | Status | Notes |
|---------|--------|-------|
| Granular permissions | ❌ | Role-array checks only |
| Permission table | ❌ | No `permissions` table |
| Resource + action model | ❌ | `readRoles`/`writeRoles` arrays |
| Dynamic role management | ❌ | Roles hardcoded in seed |

---

## 12. Dynamic Menu (Skill §26)

| Feature | Status | Notes |
|---------|--------|-------|
| Permission-aware sidebar | ⚠️ | `workspace.tsx` shows/hides by role |
| Module-aware menu | ❌ | Hardcoded sidebar items |
| Tenant config-driven | ❌ | — |

---

## 13. UI State Requirements (Skill §29)

| Feature | Status | Notes |
|---------|--------|-------|
| Loading states | ⚠️ | Basic loading spinner |
| Skeleton loaders | ❌ | No skeleton UI |
| Empty states | ⚠️ | Basic "no records" text |
| Error states | ⚠️ | Toast notifications |
| Retry mechanism | ❌ | No retry buttons |
| Permission denied UI | ❌ | Toast only |
| Destructive confirmations | ❌ | No confirmation dialogs |
| Unsaved changes warning | ❌ | — |

---

## Summary Scorecard

| Module | Exists | Partial | Missing | Completion |
|--------|--------|---------|---------|------------|
| UI Library (MUI) | 0 | 0 | 8 | **0%** |
| Design System | 0 | 2 | 4 | **17%** |
| Student Module | 0 | 10 | 15 | **0%** |
| Faculty Portal | 0 | 3 | 2 | **0%** |
| CMS/Website | 1 | 5 | 18 | **4%** |
| Hospital | 0 | 1 | 18 | **0%** |
| Academic | 2 | 7 | 3 | **17%** |
| Examination | 3 | 2 | 6 | **27%** |
| Finance | 3 | 2 | 6 | **27%** |
| Reports | 0 | 0 | 2 | **0%** |
| RBAC | 0 | 0 | 4 | **0%** |
| UI States | 0 | 4 | 5 | **0%** |

**Overall estimated completion vs skill requirements: ~10-12%**

The strongest areas are the core domain logic (business rules, validation, workflows) and the existing database schema. The weakest areas are the frontend UI (no component library, monolithic workspace), hospital management (entirely absent), and student-specific experiences.
