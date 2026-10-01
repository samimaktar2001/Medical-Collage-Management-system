# Duplicate Components & Conflicts — Medora Medical College Platform

> Audited: 2026-10-01

---

## 1. Duplicate / Overlapping UI Components

### 1.1 Landing Page vs Institution Homepage

| Aspect | `page.tsx` (Landing `/`) | `institution/page.tsx` (Institution `/institution`) |
|--------|--------------------------|------------------------------------------------------|
| Lines | 722 | 157 |
| Rendering | Client-side | Server-side |
| Content | Hardcoded notices, testimonials, stats | API-driven from `publicContent` |
| Purpose | Marketing/promotional landing | Academic/institutional info |
| Navigation | None (self-contained) | Shared institution layout |
| Brand | "MedicaCare" style (from mockups) | "Medora" brand |

**Conflict:** Two separate "homepages" exist. The skill requires ONE CMS-driven public website with a dynamic homepage builder. The landing page at `/` has hardcoded content that duplicates what the institution homepage should provide.

**Resolution:** Merge into a single CMS-driven homepage at `/` (or `/institution`). Landing page content should come from CMS sections.

---

### 1.2 Notice Display Components

| Location | Component | Data Source |
|----------|-----------|-------------|
| `page.tsx` (Landing) | Hardcoded `notices` array (L72-91) | Static const |
| `institution/page.tsx` | `NoticeRows` component | API via `publicContent` |
| `institution/notices/page.tsx` | Full notice board | API via `publicContent` |
| `workspace.tsx` (Portal) | Generic resource list for `notices` | `/api/v1/notices` |

**Conflict:** 4 different places render notices with different data sources. Landing page has fake hardcoded notices while institution pages use real API data.

---

### 1.3 Testimonials

| Location | Source |
|----------|--------|
| `page.tsx` (Landing, L94-120) | Hardcoded array of 3 testimonials |
| Skill requirement | CMS Testimonials collection |

**Conflict:** Testimonials are hardcoded static data. Should be a CMS content collection.

---

### 1.4 Statistics / KPIs

| Location | Values | Source |
|----------|--------|--------|
| `page.tsx` (Landing) | 25+ Departments, 15+ Years, 10K+ Students | Hardcoded |
| Reference mockup (Image 3) | 2,847 students, 368 faculty, etc. | Should be API |
| `workspace.tsx` dashboard | Generic counts | API `/api/v1/dashboard` |

**Conflict:** Three different sets of statistics. Landing page has fake promotional numbers; portal has real but limited dashboard; mockup shows rich KPIs that don't exist.

---

## 2. Duplicate CSS / Styling Patterns

### 2.1 CSS File Overlap

| Pattern | `globals.css` | `website.css` | `landing.module.css` |
|---------|--------------|---------------|---------------------|
| Color variables | ✅ `:root` vars | Redefines some | Uses `globals.css` vars |
| Typography | `body`, `h1-h3` | `.college-*` overrides | CSS Module scoped |
| Button styles | Generic `button` | `.college-button` | `.heroBtn`, `.ctaBtn` |
| Card styles | `.dash-card` | `.college-*` cards | `.featureCard` |
| Table styles | `.table-wrap`, `table` | N/A | N/A |
| Form styles | `label`, `input` | `.college-search` | N/A |
| Layout/grid | `.sidebar`, `.main` | `.college-width` | Various grids |
| Modal/dialog | `.modal-overlay` | N/A | N/A |
| Responsive | Media queries | Separate media queries | Separate media queries |

**Finding:** Three independent CSS architectures coexist:
1. Portal UI (`globals.css`) — 1,614 lines
2. Public website (`website.css`) — 1,149 lines  
3. Landing page (`landing.module.css`) — 1,280 lines

Each defines its own layout system, responsive rules, and component styles. No shared design tokens beyond the root CSS variables.

---

### 2.2 Duplicated Color Definitions

```css
/* globals.css */
--navy: #102a43;
--teal: #0f766e;
--canvas: #f5f7fa;

/* website.css - uses some of the same values but also different ones */
.college-brand-mark { background: #0f766e; }
.college-intro { background: #0f172a; }       /* Different navy */
.college-footer { background: #0c1e2e; }      /* Yet another dark */

/* landing.module.css - uses CSS vars from globals.css but also hardcodes */
.hero { background: ... }                      /* Custom gradients */
```

---

## 3. Duplicate / Conflicting Data Patterns

### 3.1 Department Data

| Source | Format | Location |
|--------|--------|----------|
| `masters` table (kind='Department') | `{code, name}` | Database |
| `institution/page.tsx` L128-140 | Hardcoded strings | Frontend |
| `navigation.tsx` L11 | Hardcoded link to `/institution/departments` | Frontend |
| Reference mockup | Rich department cards with icons | UI reference |

**Conflict:** Departments exist in the `masters` table but the public website hardcodes department names in JSX. CMS should own department display data.

---

### 3.2 Navigation Links

| Source | Links | Editable |
|--------|-------|----------|
| `navigation.tsx` | 10 hardcoded links | ❌ |
| `institution/layout.tsx` footer | 10 hardcoded footer links | ❌ |
| Skill requirement | Dynamic navigation manager | — |

**Conflict:** Navigation appears in 2 places with slightly different link sets, both hardcoded. Should be a single dynamic navigation system.

---

### 3.3 Brand Identity

| Source | Name | Tagline |
|--------|------|---------|
| `institution/layout.tsx` | "medora MEDICAL COLLEGE" | "Education · Care · Research · Community" |
| `page.tsx` (Landing) | "Medora" | Various promotional text |
| Email template (`main.ts`) | "MEDORA" | "Medora Medical College" |
| Reference mockup Image 1 | "MedicaCare Medical College & Hospital" | Different brand |
| `metadata` in layout | "Medora Medical College" | — |

**Note:** The reference mockups use "MedicaCare" branding while the codebase uses "Medora". This is expected (mockups are generic references), but worth noting for implementation.

---

## 4. Conflicting Architectural Patterns

### 4.1 Routing Approach

| Area | Pattern | Issue |
|------|---------|-------|
| Public website | Next.js App Router routes (`/institution/[slug]`) | ✅ Proper |
| Portal | Single page with search params (`/portal?view=X`) | ❌ Anti-pattern |
| Skill requirement | Proper App Router routes (`/students`, `/students/[id]`) | — |

**Conflict:** The portal uses a SPA pattern inside Next.js App Router, losing benefits of:
- URL-based navigation
- Page-level code splitting
- Server-side rendering for portal pages
- Browser back/forward
- Deep linking

---

### 4.2 Record Display Pattern

| Pattern | Current | Required |
|---------|---------|----------|
| Student list | Generic table (same as every other resource) | Dedicated MUI DataGrid with rich filters |
| Student detail | Generic key-value display | Tabbed profile with 10+ sections |
| Student creation | Generic form from field config | 13-step MUI Stepper wizard |
| Dashboard | Flat number cards | Rich charts, distributions, quick actions |

**Conflict:** The "generic resource" pattern (`resource-config.ts` → `workflows.tsx` → `record-detail.tsx`) treats ALL entities identically. The skill requires purpose-built UIs for students, CMS, hospital, etc.

---

## 5. Potential Table Conflicts (Per Skill §27)

| Existing Table | Potential Duplicate Risk |
|----------------|------------------------|
| `content` | vs future `cms_pages`, `cms_sections` |
| `masters` (kind='Department') | vs future `departments` table with richer fields |
| `masters` (kind='Programme') | vs future `courses` / `programs` table |
| `users` (role='faculty') | vs future `faculty` table with specialization |
| `notices` (internal) | vs `content` (kind='Notice', public) |

**Key concern:** The `masters` table is a generic key-value store. The skill requires rich entities (departments with HOD, facilities, contact info; courses with curriculum, duration, eligibility). These may need dedicated tables while keeping `masters` for simple reference data.

---

## 6. Summary of Actions Required

1. **Merge** landing page and institution homepage into one CMS-driven page
2. **Replace** hardcoded content arrays with CMS API calls
3. **Eliminate** 3 independent CSS architectures → MUI Theme
4. **Migrate** portal from SPA pattern to App Router routes
5. **Replace** generic resource views with purpose-built module UIs
6. **Deduplicate** navigation links into a dynamic navigation manager
7. **Resolve** brand identity to a single tenant-configurable source
8. **Assess** whether `masters` table suffices or dedicated entity tables are needed for departments, courses, etc.
