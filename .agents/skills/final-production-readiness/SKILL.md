---
name: final-production-readiness
description: Deep production-readiness audit and implementation pass for the Medical College Management System covering end-to-end forms, validation, server-side pagination, search, filter, RBAC, and live PostgreSQL integration.
---

# Final Production Readiness Skill

Follow the comprehensive instructions in [docs/audit/FINAL-PRODUCTION-READINESS-SKILL.md](file:///d:/Samim_Development/Coding/medical-college/docs/audit/FINAL-PRODUCTION-READINESS-SKILL.md).

## Key Directives:
1. Verify the complete chain: Frontend UI → API → Backend validation → Database → API response → Frontend UI.
2. Required field UI must consistently show red asterisk `*`.
3. Client-side inline errors before API submission.
4. Server-side validation via Zod schemas and DB constraints.
5. Standardized error and success responses.
6. Server-side search, filtering, and pagination.
7. Pagination UI: "Showing X to Y of Z results" on left, `«`, `<`, numbers, `>`, `»` on right, matching Medora theme.
8. RBAC enforced on backend.
9. No mock/static data on dashboards or lists.
10. Dynamic Content & Fully Interactive UI:
    - All manageable application content must be dynamically managed through the appropriate backend/API/database flow.
    - Every interactive button, action, menu item, tab, dropdown, filter, search field, pagination control, modal, drawer, form submission, status action, and navigation action must be functional and connected to its intended behavior.
    - No visible button should exist only for visual/demo purposes.
    - Do not leave dead buttons, fake actions, placeholder handlers, or UI controls that do nothing.
    - **Zero Native Browser Alerts / Confirms**: Never use `window.alert()` or `window.confirm()`. All user confirmations, destructive decisions, and critical prompts must use accessible themed modals (`ConfirmDialog` / `useConfirm`). All non-blocking operation feedback, success states, and errors must use toast notifications (`react-hot-toast`).

---

## 11. Database Schema, Migration & Data Integrity Skill

The database must be treated as the **single source of truth** for all persistent application data.

### Mandatory Requirements
* Every business/institutional entity must have a proper database table/model.
* Every table must have:
  * Primary key
  * Proper foreign keys
  * Required/nullable fields correctly defined
  * Appropriate unique constraints
  * Appropriate indexes
  * Created/updated timestamps
  * Soft-delete/archive fields where business logic requires them
* Avoid storing relational business data as uncontrolled JSON when a proper relational structure is required.
* Avoid duplicate storage of the same business data in multiple unrelated tables.

### Migration Requirements
Every database schema change must be handled through a proper migration.

Examples:
* New table → migration
* New column → migration
* Column modification → migration
* Foreign key → migration
* Index → migration
* Unique constraint → migration
* Enum/status change → migration
* Data transformation/backfill → migration when required

Never modify the production database manually as a replacement for a migration.

Migration requirements:
1. Migration must be reproducible.
2. Migration must be ordered correctly.
3. Migration must be safe for existing data.
4. Destructive migrations must be explicitly reviewed.
5. Existing records must not be accidentally deleted.
6. Foreign-key relationships must remain valid.
7. Migration state must remain synchronized with the actual database.
8. Fresh database setup must work from migrations alone.

### Data Integrity
Verify:
```text
Database
   ↓
Constraints
   ↓
Foreign Keys
   ↓
Transactions
   ↓
Backend Validation
   ↓
API
```

Business-critical operations must use database transactions where multiple related records are created/updated/deleted.
Examples: Student admission, fee payment, examination result publishing, appointment booking, patient admission, bed allocation, prescription creation, pharmacy stock deduction, inventory transaction, payroll processing, blood issue, OT booking, user/role/permission changes.

Never rely only on frontend validation for data integrity.

---

## 12. Backend API Architecture & Strong Backend Skill

The backend must be treated as the **authoritative business-logic layer**.

Frontend code must never be trusted for:
* Authorization
* Role verification
* Permission verification
* Price calculation
* Fee calculation
* Stock calculation
* Appointment availability
* Exam/result validation
* Financial calculations
* Status transitions
* Ownership validation
* Data access restrictions
* Sensitive business rules

### Every API Must Have
```text
Request
   ↓
Authentication
   ↓
Authorization / RBAC
   ↓
Input Validation
   ↓
Business Rule Validation
   ↓
Database Operation
   ↓
Transaction (when required)
   ↓
Audit Log (when required)
   ↓
Standardized Response
```

### API Requirements
Every endpoint must have:
* Proper HTTP method
* Authentication requirement
* RBAC/permission requirement
* Request schema
* Response schema
* Error handling
* Validation
* Database interaction
* Proper status codes
* Consistent response structure

Do not create APIs that simply return whatever the frontend expects without enforcing business rules.

### No Weak/Fake Backend
Do not allow:
* Empty API handlers
* Placeholder controllers
* Fake success responses
* `return { success: true }` without performing the operation
* Frontend-only CRUD
* Client-side permission enforcement only
* Mock API responses
* Hardcoded API responses
* Fake dashboard statistics
* Static patient/student/doctor records
* Randomly generated production data
* `setTimeout()` pretending to be an API call
* Development-only bypasses remaining in production

Every mutation API must actually persist the requested change when successful.

---

## 13. No Fallback / No Hardcoded Business Data Skill

Production application must have **zero hidden fallback business data**.

Do not use patterns such as:
```ts
const doctors = apiDoctors || defaultDoctors;
const students = data || mockStudents;
const stats = apiStats || { students: 1200, doctors: 150 };
catch { return demoData; }
const departments = response?.data ?? hardcodedDepartments;
```
These are prohibited for production business data.

### Required Behavior
If the API returns no data:
```text
API returns empty → Frontend displays Empty State
```

If the API fails:
```text
API fails → Frontend displays Error State → Retry option
```

If data is loading:
```text
API loading → Skeleton / Loading State
```

Never show fake data on failure.

### Allowed Static Content
Static UI content is allowed: button labels, navigation labels, form labels, icons, UI headings, validation messages, fixed system terminology.
Must NOT be hardcoded: doctors, faculty, students, departments, courses, fees, notices, news, events, hospital facilities, beds, services, emergency contacts, appointment schedules, statistics, research data, inventory, financial information.

---

## 14. Frontend API Integration Skill

Frontend must consume real backend APIs for all dynamic data.

Required architecture:
```text
React Component
      ↓
API / Query Layer
      ↓
Backend Endpoint
      ↓
Validation
      ↓
Database
      ↓
API Response
      ↓
Query Cache / State
      ↓
UI
```

### Rules
* Do not directly place database/business logic inside UI components.
* Do not create separate API implementations for the same endpoint in multiple components.
* Centralize API communication through a reusable API/query layer (`api/`, `services/`, `queries/`, `mutations/`, `hooks/`).
* Handle all states: Loading (Skeleton), Success (Real data), Empty (Empty State), Error (Error State + Retry).
* Never silently swallow API errors (`catch(() => {})` or `catch(() => null)`).

---

## 15. Frontend State Management Skill

State management must keep the application fast, predictable, and synchronized with the backend.

### Categories:
* **Server State**: Students, doctors, departments, appointments, patients, fees, results, attendance, inventory, notifications (managed through query/cache layer).
* **UI State**: Modal open/close, sidebar state, selected tab, drawer state, filter panel, temporary form state.
* **Form State**: Admission form, patient registration, appointment form, fee payment form, doctor profile form.
* **Global Application State**: Authenticated session and active theme/locale only.

### State Synchronization:
After a successful mutation:
```text
Create / Update / Delete / Approve / Reject / Publish / Archive / Status Change
      ↓
Invalidate / Update Relevant Query
      ↓
Fetch / Update Latest Server Data
      ↓
UI Automatically Reflects Current Data
```
Never require a full page refresh just to show a successful CRUD operation.

---

## 16. Fast & Smooth Frontend Performance Skill

* Avoid unnecessary re-renders.
* Cache appropriate server data; avoid fetching the same data repeatedly.
* Use server-side pagination, search, and filtering.
* Debounce search inputs.
* Lazy-load heavy modules, pages, tables, and charts.
* Optimize images; use skeleton loaders instead of blank screens.
* Prevent duplicate API requests and cancel stale requests.

### Large Data Rule:
Never load an entire large table simply to display the first page. Use:
```text
?page=1&pageSize=20&search=&sortBy=&sortOrder=&filter=
```

### Smooth Mutation UX:
1. Disable duplicate submission.
2. Show processing state.
3. Call real API.
4. Handle API response.
5. Show success/error feedback.
6. Synchronize affected data.
7. Keep user on the correct screen.

---

## 17. API Contract & Type Safety Skill

Frontend and backend must follow a consistent API contract.

Standard success format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "meta": {}
}
```

Standard error format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid input provided",
    "fieldErrors": {
      "email": "Email is already in use"
    }
  }
}
```
Frontend must not guess the response structure. Avoid excessive `any` types.

---

## 18. CRUD Completeness Skill

For every database-backed entity, verify the complete lifecycle:
```text
CREATE → READ → LIST → SEARCH → FILTER → SORT → PAGINATE → VIEW DETAILS → UPDATE → STATUS CHANGE → ARCHIVE / DELETE
```
Each action must be fully connected:
```text
Button → Frontend Handler → API Call → Backend Controller → Validation → Business Logic → Database → Response → Frontend State Update
```

---

## 19. Error Handling & Recovery Skill

### Never:
* Hide errors
* Replace errors with fake data
* Show success when API failed
* Ignore failed mutations
* Leave buttons permanently disabled
* Leave loading indicators indefinitely
* Crash the entire page because one API failed

### Required:
Provide inline validation errors, toast notifications, error banners, empty states, retry actions, loading states, and session expiry handling.

---

## 20. Final Full-Stack Production Chain Verification

Before declaring any module production-ready, verify the complete chain:
```text
UI
 ↓
Form / Interaction
 ↓
Frontend Validation
 ↓
API Client
 ↓
Authentication
 ↓
RBAC
 ↓
Backend Validation
 ↓
Business Rules
 ↓
Database Transaction
 ↓
Database
 ↓
API Response
 ↓
Query / State Synchronization
 ↓
UI Update
```

A feature is **NOT production-ready** if any link is missing.
