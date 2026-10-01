# Medical College Management System — UI, Student Module & Dynamic CMS Skill

## 0. Objective

Upgrade the existing Medical College / Healthcare SaaS application into a production-grade, fully dynamic system.

The existing project already contains public Institute/Landing pages for college/institution promotion. Do NOT remove working functionality blindly.

The target architecture must clearly separate:

1. Public Institution Website
2. Private Management Portal
3. Student / Faculty / Patient portals
4. Platform/Super Admin

The public website and the management portal must share the same tenant data but must not be the same UI.

---

# 1. Mandatory Existing-Project Audit

Before changing code:

- Inspect the complete repository.
- Inspect `apps/web`.
- Inspect all App Router routes.
- Inspect all API modules.
- Inspect database schema and migrations.
- Inspect existing authentication/RBAC.
- Inspect existing Institute page.
- Inspect existing Landing/Home page.
- Inspect existing CMS/content models if any.
- Inspect all CSS files:
  - `globals.css`
  - `website.css`
  - `landing.module.css`
  - other CSS Modules / stylesheet files.
- Identify duplicated UI components.
- Identify hardcoded website content.
- Identify hardcoded student/academic/hospital data.
- Identify mock data that should become API-backed.
- Identify routes that already solve part of the requirement.

Create:
- `docs/audit/current-state.md`
- `docs/audit/missing-features.md`
- `docs/audit/duplicate-components.md`
- `docs/audit/css-migration-plan.md`

Never claim the repository is fully audited until the source has actually been inspected.

---

# 2. UI Library Migration — Mandatory

## Replace Custom CSS UI

The current project uses custom CSS / CSS Modules heavily.

Do not continue expanding the custom CSS architecture.

Adopt:

- `@mui/material`
- `@emotion/react`
- `@emotion/styled`
- `@mui/material-nextjs`
- `@mui/x-data-grid`
- `@mui/x-date-pickers`
- `@mui/icons-material`

Keep:
- React Hook Form
- Zod
- TanStack Query
- Recharts if already used and useful
- existing backend libraries
- existing authentication
- existing database

Do NOT introduce another competing UI framework.

Do NOT add:
- Bootstrap
- Ant Design
- Chakra UI
- Tailwind UI
- multiple component libraries

Use one consistent UI system.

## Next.js Integration

Use the official MUI App Router integration.

Use the MUI cache provider correctly so SSR styles are handled correctly.

Do not create large global CSS files to recreate MUI.

Prefer:
- MUI Theme
- `sx`
- `styled`
- component variants
- design tokens
- responsive MUI breakpoints

Global CSS should remain minimal and infrastructure-level only.

---

# 3. Design System

Preserve the existing premium medical identity.

## Primary

Clinical Teal:
- `#0F766E`
- `#007B80`

## Navy

Medical Navy:
- `#102A43`
- `#0F172A`
- `#020617`

## Accent

Mint/Turquoise:
- `#5EEAD4`
- `#2DD4BF`

Academic Gold:
- `#FACC15`
- `#EAB308`

Canvas:
- `#F8FAFC`
- `#F5F7FA`

Text:
- `#1E293B`
- `#334155`

Borders:
- `#E2E8F0`

## UI Rules

- Premium healthcare + academic visual language.
- Clean enterprise density.
- No excessive glassmorphism.
- No giant decorative cards.
- No excessive gradients.
- No excessive animations.
- No hover-only critical information.
- Short subtle transitions only.
- Excellent empty/loading/error states.
- Keyboard accessible.
- Responsive desktop/tablet/mobile.
- PWA-friendly.
- Consistent page widths and spacing.
- Consistent table/form/modal/drawer patterns.

---

# 4. Student Module — MUST EXIST

A single Student Management table is NOT enough.

Student management must contain a complete lifecycle.

## 4.1 Student Dashboard

Route example:

`/students`

Show:

- Total students
- Active students
- New admissions
- Graduated
- On leave
- Dropout/withdrawn
- Course distribution
- Department distribution
- Year/batch distribution
- Attendance summary
- Fee collection summary
- Examination performance summary
- Pending documents
- Upcoming exams
- Upcoming clinical rotations
- Recent admissions
- Recent student activities
- Quick actions

All values must come from APIs.

No fake hardcoded KPI values in production.

---

# 5. Student List

Route:

`/students/list`

Features:

- Server-side search
- Student ID / roll search
- Name search
- Course filter
- Department filter
- Batch filter
- Academic year filter
- Semester/year filter
- Status filter
- Admission date filter
- Attendance filter
- Fee status filter
- Pagination
- Sorting
- Column visibility
- Export where authorized
- Bulk actions where authorized
- View
- Edit
- Archive
- Print ID card
- Generate documents

Use MUI DataGrid.

Do not load thousands of students into the browser unnecessarily.

---

# 6. Student Admission / Create Student

Route:

`/students/new`

Use a multi-step MUI Stepper.

Steps:

1. Personal information
2. Contact information
3. Guardian/family
4. Address
5. Admission information
6. Course/department
7. Batch/academic year
8. Previous education
9. Documents
10. Hostel information if applicable
11. Fee structure
12. Review
13. Submit

Validation:

- Client-side Zod
- Server-side validation
- Duplicate student detection
- Duplicate email/phone rules
- Course eligibility
- Batch validation
- Required document validation
- Transaction-safe creation

Never trust:
- tenant ID
- role
- user ID
- academic status
- fee amount

from the browser.

---

# 7. Student Profile

Route:

`/students/[studentId]`

This is a major page and MUST be designed separately.

Header:

- Student photo
- Student ID
- Name
- Course
- Department
- Batch
- Current year/semester
- Status
- Contact
- Quick actions

Tabs:

### Overview
- Basic information
- Guardian
- Contact
- Address
- Admission information

### Academic
- Program
- Department
- Subjects
- Curriculum
- Semester history
- Academic progression
- GPA/marks

### Attendance
- Overall attendance
- Subject-wise attendance
- Monthly attendance
- Clinical attendance
- Leave history

### Examination
- Upcoming exams
- Previous exams
- Marks
- Grades
- Results
- Backlogs
- Revaluation

### Fees
- Fee structure
- Invoices
- Payments
- Outstanding amount
- Scholarships
- Discounts
- Receipts

### Clinical Training
- Clinical rotations
- Departments visited
- Logbook
- Procedures
- Case exposure
- Supervisor feedback

### Internship
- Internship program
- Rotation schedule
- Attendance
- Assessment
- Completion

### Hostel
- Hostel
- Room
- Bed
- Allocation history
- Fees
- Complaints

### Documents
- Admission documents
- Certificates
- ID proof
- Academic documents
- Medical documents
- Signed forms

### Communication
- Notices
- Messages
- Notifications
- Parent/guardian communication

### Audit
Only authorized staff can access sensitive audit history.

---

# 8. Student Actions

From Student Profile:

- Edit
- Change status
- Promote
- Transfer department
- Change batch
- Apply leave
- Add document
- Add note
- Record payment
- Print ID
- Generate certificate
- Export profile
- Archive
- Restore where permitted

Every sensitive mutation:
- authorization
- validation
- business rule
- audit log

---

# 9. Student Portal

Do not confuse Admin Student Management with Student Portal.

Create a separate student-facing experience.

Possible route:

`/student-portal`

Student can see:

- Dashboard
- Profile
- Attendance
- Timetable
- Exams
- Results
- Fees
- Payments
- Documents
- Notices
- Assignments if supported
- Clinical logbook
- Internship
- Hostel
- Library
- Leave
- Notifications
- Helpdesk
- Settings

Student can only access their own permitted data.

---

# 10. Faculty Portal

Faculty should have a separate role-aware portal:

- Dashboard
- Assigned subjects
- Timetable
- Student attendance
- Examination
- Marks entry
- Results
- Clinical supervision
- Logbook review
- Notices
- Leave
- Profile

Permission must be action-level, not simply `faculty = true`.

---

# 11. Public Website / CMS Decision

The existing Institute page and Landing page SHOULD NOT be removed.

They should become part of a proper dynamic tenant website/CMS.

Do not maintain:
- one static Landing page
- another static Institute page
- hardcoded doctors
- hardcoded departments
- hardcoded services

Instead create one CMS-driven public website system.

## Public Website Structure

Example:

`/`
- Homepage

`/about`
- Institution/Institute
- Mission
- Vision
- Leadership

`/departments`
- Department directory

`/departments/[slug]`

`/doctors`

`/doctors/[slug]`

`/courses`

`/facilities`

`/services`

`/admissions`

`/notices`

`/events`

`/news`

`/gallery`

`/faq`

`/careers`

`/contact`

`/appointment`

`/downloads`

`/privacy`

`/terms`

`/[custom-slug]`

---

# 12. CMS Admin

Create:

`/cms`

Main areas:

## Website Overview

- Website status
- Draft/published status
- Pending changes
- SEO health
- Page count
- Media usage
- Recent edits

## Homepage Builder

Manage sections:

- Hero
- Announcement
- About
- Statistics
- Courses
- Departments
- Facilities
- Doctors
- Hospital services
- Admissions CTA
- Testimonials
- Gallery
- News
- Events
- Contact CTA
- Footer

Sections must be data-driven.

Admin can:
- enable/disable section
- reorder section
- edit content
- upload media
- change CTA
- preview
- publish

---

# 13. CMS Pages

CRUD:

- Create page
- Edit page
- Draft
- Preview
- Publish
- Unpublish
- Archive
- Restore
- Schedule publication if implemented
- Revision history

Fields:

- title
- slug
- content/blocks
- hero
- featured image
- SEO title
- meta description
- canonical URL
- OG image
- status
- publishedAt

Slug must be unique per tenant.

---

# 14. CMS Content Collections

Create dynamic collections for:

- Departments
- Doctors
- Courses
- Programs
- Services
- Facilities
- News
- Events
- Notices
- FAQ
- Testimonials
- Gallery
- Admissions information
- Leadership
- Downloads
- Careers
- Contact information

Public pages read from these APIs.

No hardcoded production content.

---

# 15. CMS Media Library

Features:

- Upload
- Search
- Filter
- Preview
- Folder/category
- Alt text
- Caption
- Metadata
- Replace
- Archive
- Usage tracking

Private media must use authorized access.

Public media must be intentionally marked public.

Validate:
- MIME
- file size
- extension
- upload authorization

---

# 16. CMS Branding

Tenant-specific:

- Institution logo
- Favicon
- Primary color
- Secondary color
- Typography choice from approved set
- Header
- Footer
- Social links
- Contact information
- Emergency number
- Address
- Google Maps configuration
- Footer legal links

Do not allow arbitrary CSS injection.

Branding must be controlled through configuration.

---

# 17. CMS Navigation

Dynamic navigation manager:

- Header menu
- Footer menu
- CTA buttons
- External links
- Internal pages
- Visibility
- Ordering

Never hardcode navigation in multiple places.

---

# 18. CMS SEO

Per tenant and per page:

- SEO title
- Meta description
- Canonical
- OG title
- OG description
- OG image
- robots
- sitemap
- structured data

Generate dynamic sitemap and metadata.

---

# 19. CMS Publishing Workflow

Recommended lifecycle:

`DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED -> ARCHIVED`

Permissions:

- Editor: create/edit draft
- Reviewer: review
- Publisher: publish
- Admin: full access

Every publication action creates an audit event.

---

# 20. Hospital Management Pages

The existing dashboard is only one screen.

Required major screens:

1. Hospital Dashboard
2. Patient Management
3. Patient Profile
4. OPD
5. Appointment
6. IPD/Ward
7. Bed Management
8. Nursing
9. Emergency
10. Laboratory
11. Radiology
12. Pharmacy
13. Prescription
14. Operation Theatre
15. Blood Bank
16. Inventory
17. Billing
18. Finance
19. Reports

---

# 21. Academic Pages

Required:

- Academic Dashboard
- Departments
- Programs/Courses
- Subjects
- Curriculum
- Academic Years
- Batches
- Semester/Year
- Timetable
- Attendance
- Examination
- Results
- Promotion
- Academic Calendar

---

# 22. Examination Pages

Required:

- Exam dashboard
- Exam schedule
- Exam creation
- Exam registration
- Admit cards
- Exam halls
- Seating
- Invigilators
- Marks entry
- Practical/viva
- Internal assessment
- Results
- Grade rules
- Backlogs
- Revaluation
- Result publishing

---

# 23. Finance Pages

Required:

- Finance dashboard
- Fee structures
- Student invoices
- Payments
- Refunds
- Scholarships
- Discounts
- Expenses
- Revenue
- Tax/GST where applicable
- Doctor settlements where applicable
- Financial reports
- Receipts

All money calculations must be server-side.

---

# 24. Reports

Central reporting system:

- Student report
- Attendance
- Examination
- Results
- Admissions
- Fees
- Revenue
- OPD
- IPD
- Bed occupancy
- Pharmacy
- Laboratory
- Inventory
- HR
- Payroll
- Hostel
- Website analytics
- CMS analytics

Every report:

- filter
- date range
- pagination
- server-side query
- export authorization
- audit export action

---

# 25. RBAC

Permissions must be granular.

Example:

`students.read`
`students.create`
`students.update`
`students.archive`
`students.export`
`students.documents.read`

`cms.pages.read`
`cms.pages.create`
`cms.pages.update`
`cms.pages.publish`

`patients.read`
`patients.create`
`patients.update`
`patients.sensitive.read`

`finance.payments.create`
`finance.refunds.approve`

Never use only:

`if role === "admin"`

Use:
- user
- tenant
- role
- permission
- resource
- action

---

# 26. Dynamic Menu

Sidebar must be generated from:

- enabled modules
- user permissions
- tenant configuration
- feature entitlements

Do not hardcode visibility only in React.

Backend authorization remains mandatory.

---

# 27. Data Architecture

Before creating a table:

1. Search existing schema.
2. Search existing model.
3. Search existing API.
4. Search existing repository/service.
5. Reuse if possible.
6. Add migration only when required.

Avoid duplicate entities such as:

- students vs student_profiles
- pages vs cms_pages
- doctors vs faculty_doctors
- departments vs academic_departments

Document canonical ownership of each entity.

---

# 28. API Standards

Every endpoint:

- authentication
- tenant resolution
- authorization
- DTO validation
- pagination where required
- filtering
- sorting
- consistent error format
- audit for mutations
- transaction where needed

Never trust frontend:
- tenantId
- userId
- role
- permissions
- prices
- totals
- status transitions

---

# 29. UI State Requirements

Every important page must have:

- loading
- skeleton
- empty
- error
- retry
- success
- permission denied
- destructive confirmation
- unsaved changes warning where needed

Forms:

- field validation
- server error mapping
- disabled submit while pending
- success notification
- reset/redirect behavior

---

# 30. Premium UI Screen Set

Generate visual references and implement these pages consistently:

### Academic
1. Executive Dashboard
2. Academic Dashboard
3. Student Management
4. Student Admission Wizard
5. Student Profile
6. Faculty Management
7. Department Management
8. Course/Curriculum
9. Timetable
10. Attendance
11. Examination
12. Results

### Hospital
13. Hospital Dashboard
14. Patient Management
15. Patient Profile
16. OPD
17. Appointments
18. IPD/Ward
19. Bed Management
20. Emergency
21. Laboratory
22. Radiology
23. Pharmacy
24. Operation Theatre
25. Blood Bank

### Administration
26. Finance
27. HR
28. Payroll
29. Inventory
30. Hostel
31. Library
32. Reports
33. Notifications
34. Audit Logs
35. Settings
36. RBAC

### CMS
37. CMS Dashboard
38. Homepage Builder
39. Page Manager
40. Page Editor
41. Navigation Manager
42. Media Library
43. Doctors CMS
44. Departments CMS
45. Services CMS
46. News/Events CMS
47. FAQ/Testimonials CMS
48. SEO Manager
49. Branding Manager
50. Preview/Publish

---

# 31. Screenshot Generation Rule

For each major page:

- use the same sidebar
- same topbar
- same typography
- same spacing
- same card language
- same table language
- same status colors
- same button hierarchy
- same responsive behavior

Student Profile must look like the natural detail-page continuation of Student Management.

CMS screens must feel like the same application, but content-editing focused.

Public website must use tenant branding and a separate public layout.

---

# 32. No Hardcoded Data

Demo/seed data is allowed only for development/demo.

Production UI must consume:

`Database -> API -> TanStack Query -> MUI UI`

No hardcoded:
- KPI values
- student rows
- doctors
- departments
- website content
- menu items
- permissions
- plans
- tenant information

Use seed scripts for demo data.

---

# 33. Completion Gate

A module is NOT complete until:

- UI exists
- MUI components used
- API exists
- DB exists/reused
- validation exists
- authorization exists
- tenant isolation exists
- loading/empty/error states exist
- audit exists
- tests exist
- mobile works
- no TypeScript errors
- no lint errors
- no runtime errors
- no duplicate tables
- no duplicate routes
- no hardcoded production data

---

# 34. Important Instruction to Antigravity

Do not rebuild the whole application blindly.

First audit.

Then produce:

1. Existing route map
2. Existing module map
3. Existing DB entity map
4. Existing CMS map
5. Existing Student map
6. CSS migration map
7. Duplicate/conflict list
8. Missing feature matrix
9. Migration sequence

Only after this begin implementation.

The target is:

ONE production SaaS application
+
ONE reusable design system
+
MUI-based UI
+
fully dynamic data
+
multi-tenant isolation
+
Student lifecycle
+
Academic management
+
Hospital management
+
CMS-driven public institution website
+
RBAC
+
auditability
+
production QA
