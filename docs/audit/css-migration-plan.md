# CSS → MUI Migration Plan — Medora Medical College Platform

> Audited: 2026-10-01

---

## 1. Current CSS Inventory

| File | Lines | Size | Scope | Migration Priority |
|------|-------|------|-------|--------------------|
| `globals.css` | 1,614 | 27KB | Portal: sidebar, tables, forms, modals, dashboard, auth | **P0 — First** |
| `website.css` | 1,149 | 23KB | Public institution website | **P2 — Later** |
| `landing.module.css` | 1,280 | 26KB | Landing/marketing page | **P2 — Later** |
| `custom-select.css` | 107 | 2.2KB | Custom select dropdown | **P0 — Replace** |
| **Total** | **4,150** | **~78KB** | — | — |

---

## 2. Migration Strategy

### Phase 1: Install MUI + Create Theme (Foundation)

**Actions:**
1. Install MUI packages:
   ```bash
   npm install @mui/material @emotion/react @emotion/styled @mui/material-nextjs @mui/x-data-grid @mui/x-date-pickers @mui/icons-material
   ```

2. Create MUI Theme (`apps/web/app/theme.ts`):
   - Map existing CSS variables to MUI palette
   - Configure typography (DM Sans → body, Manrope → headings)
   - Set component defaults (border-radius, shadows, etc.)
   - Configure responsive breakpoints

3. Create ThemeRegistry (`apps/web/app/ThemeRegistry.tsx`):
   - MUI cache provider for App Router SSR
   - CssBaseline for normalization

4. Update root `layout.tsx`:
   - Wrap with ThemeRegistry
   - Remove `globals.css` import (gradually)

**CSS Variable → MUI Token Mapping:**

```
--navy: #102a43      → palette.primary.dark
--teal: #0f766e      → palette.primary.main
--teal-dark: #0b5d57 → palette.primary.dark (alt)
--canvas: #f5f7fa    → palette.background.default
--ink: #203247       → palette.text.primary
--muted: #637286     → palette.text.secondary
--line: #e5eaf0      → palette.divider
--white: #fff        → palette.background.paper
--shadow              → shadows[1]
--radius: 12px       → shape.borderRadius
```

---

### Phase 2: Replace Portal CSS (`globals.css` — 1,614 lines)

This is the largest and highest-priority migration. Break into component groups:

#### 2.1 Layout Components (~200 lines)

| CSS Class | MUI Replacement |
|-----------|----------------|
| `.sidebar` | MUI `Drawer` (permanent variant) |
| `.sidebar-nav a` | MUI `List`, `ListItem`, `ListItemButton`, `ListItemIcon`, `ListItemText` |
| `.main` | MUI `Box` with `sx` |
| `.page-header` | MUI `Box` / `Stack` |
| `.topbar` | MUI `AppBar` with custom styling |

#### 2.2 Table Components (~300 lines)

| CSS Class | MUI Replacement |
|-----------|----------------|
| `.table-wrap` | `@mui/x-data-grid` `DataGrid` |
| `table`, `th`, `td` | DataGrid columns |
| `.badge` | MUI `Chip` component |
| `.status-*` colors | Chip `color` prop or `sx` |
| Pagination styles | DataGrid built-in pagination |

#### 2.3 Form Components (~250 lines)

| CSS Class | MUI Replacement |
|-----------|----------------|
| `label` | MUI `InputLabel` or `FormLabel` |
| `input`, `textarea` | MUI `TextField` |
| `select` | MUI `Select` |
| Custom checkbox | MUI `Checkbox` / `FormControlLabel` |
| `.form-row` | MUI `Grid` or `Stack` |
| Form buttons | MUI `Button` with variants |

#### 2.4 Modal / Dialog Components (~150 lines)

| CSS Class | MUI Replacement |
|-----------|----------------|
| `.modal-overlay` | MUI `Dialog` |
| `.modal-content` | `DialogTitle`, `DialogContent`, `DialogActions` |
| `.modal-close` | Dialog close button |
| `.drawer` | MUI `Drawer` (temporary) |

#### 2.5 Dashboard Components (~200 lines)

| CSS Class | MUI Replacement |
|-----------|----------------|
| `.dash-card` | MUI `Card` / `Paper` |
| `.dash-kpi` | MUI `Card` with `CardContent` |
| `.dash-chart` | Recharts inside MUI `Card` |
| `.dash-grid` | MUI `Grid` container |

#### 2.6 Authentication Components (~200 lines)

| CSS Class | MUI Replacement |
|-----------|----------------|
| `.auth-*` styles | MUI `Card`, `TextField`, `Button` |
| Login/signup forms | MUI form components |
| OTP input | MUI `TextField` with styling |

#### 2.7 Utility Styles (~300 lines)

| CSS Pattern | MUI Replacement |
|-------------|----------------|
| Flexbox utilities | `Stack`, `Box` with `sx` |
| Spacing utilities | MUI `sx` spacing (theme.spacing) |
| Typography overrides | MUI `Typography` variants |
| Color utilities | `sx` with `theme.palette` |
| Media queries | MUI `useMediaQuery` or responsive `sx` |

---

### Phase 3: Replace `custom-select.css` (107 lines)

**Direct replacement:** Remove entirely and use MUI `Select` / `Autocomplete`.

The `custom-select.tsx` component (7.5KB) should be replaced with MUI `Autocomplete` for searchable selects or MUI `Select` for simple dropdowns.

---

### Phase 4: Public Website CSS (`website.css` — 1,149 lines)

The public website could keep some custom CSS since it needs a distinct visual identity from the portal. However, it should still use MUI where beneficial.

**Strategy:** Hybrid approach
- Use MUI `ThemeProvider` with a separate public theme
- Use MUI components for interactive elements (forms, buttons, navigation)
- Keep custom CSS for unique layout patterns (hero sections, campus sections)
- Migrate gradually as CMS sections are built

| CSS Group | Lines (est.) | Approach |
|-----------|-------------|----------|
| Header/masthead | ~100 | MUI `AppBar` + custom |
| Navigation | ~120 | MUI `Tabs` or custom nav |
| Footer | ~150 | MUI `Box` + `Grid` |
| Content sections | ~300 | MUI `Container` + `Typography` |
| Notice board | ~150 | MUI `Card`, `List` |
| Forms (search, enquiry) | ~80 | MUI `TextField`, `Button` |
| Responsive/utility | ~250 | MUI `sx` responsive |

---

### Phase 5: Landing Page CSS (`landing.module.css` — 1,280 lines)

**Decision required:** Since the skill says to merge the landing page into the CMS-driven homepage, this file may be **entirely removed** once the CMS homepage builder is implemented.

**Interim plan:**
- Keep as-is until CMS homepage builder is ready
- Then remove entirely and build new homepage with MUI + CMS data

---

## 3. Migration Sequence

```
Phase 1: Foundation                    [Week 1]
├── Install MUI packages
├── Create MUI theme (colors, typography, spacing)
├── Create ThemeRegistry (SSR cache)
├── Update root layout
└── Verify SSR works

Phase 2: Portal Migration             [Week 2-3]
├── Step 1: Layout (Drawer, AppBar)
│   └── Create proper App Router routes
├── Step 2: Tables → DataGrid
│   └── Student list as first migration
├── Step 3: Forms → TextField, Select
│   └── Student creation wizard
├── Step 4: Modals → Dialog
├── Step 5: Dashboard → Cards, Charts
├── Step 6: Auth pages
└── Remove globals.css portal styles

Phase 3: Component Cleanup            [Week 3]
├── Replace custom-select → Autocomplete
├── Replace Badge → Chip
├── Replace toast → MUI Snackbar (optional, toast works)
├── Replace lucide icons → MUI icons (or keep both)
└── Remove custom-select.css

Phase 4: Public Website               [Week 4+]
├── Add public theme variant
├── Migrate interactive components
├── Build CMS section components with MUI
└── Gradually reduce website.css

Phase 5: Landing → CMS                [Week 5+]
├── Build CMS homepage builder
├── Migrate hardcoded sections to CMS
└── Remove landing.module.css
```

---

## 4. Files to Create

| File | Purpose |
|------|---------|
| `apps/web/app/theme.ts` | MUI theme configuration |
| `apps/web/app/ThemeRegistry.tsx` | App Router SSR provider |
| `apps/web/app/components/` | Shared MUI-based components directory |
| `apps/web/app/(portal)/layout.tsx` | Portal layout with MUI Drawer + AppBar |
| `apps/web/app/(portal)/dashboard/page.tsx` | Dashboard route |
| `apps/web/app/(portal)/students/page.tsx` | Students list route |
| `apps/web/app/(portal)/students/[id]/page.tsx` | Student profile route |
| `apps/web/app/(portal)/students/new/page.tsx` | Student admission wizard |

---

## 5. Files to Eventually Remove

| File | When | Reason |
|------|------|--------|
| `custom-select.css` | Phase 3 | Replaced by MUI Select/Autocomplete |
| `custom-select.tsx` | Phase 3 | Replaced by MUI components |
| `globals.css` (portal portions) | Phase 2 | Replaced by MUI theme + sx |
| `landing.module.css` | Phase 5 | Landing page merged into CMS |
| `workspace.tsx` | Phase 2 | Split into proper route-based pages |

---

## 6. Risk Mitigation

1. **Don't remove CSS before MUI replacement is working** — migrate page by page
2. **Keep `globals.css` infrastructure styles** (box-sizing, body margin) until MUI CssBaseline takes over
3. **Test SSR** — MUI + Next.js App Router requires proper cache provider setup
4. **Avoid breaking the public website** during portal migration — they use different CSS files
5. **Run visual regression** after each page migration to catch style breaks
6. **Keep Lucide icons initially** — MUI icons migration is low priority and both can coexist

---

## 7. What Stays

| Item | Reason |
|------|--------|
| React Hook Form | Skill says keep |
| Zod | Skill says keep |
| TanStack Query | Skill says keep |
| react-hot-toast | Works fine, MUI Snackbar is optional |
| Recharts | If already used |
| All backend code | No CSS there |
| Database schema | Schema is solid |
