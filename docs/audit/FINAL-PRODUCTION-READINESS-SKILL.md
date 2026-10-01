# FINAL PRODUCTION READINESS AUDIT & IMPLEMENTATION SKILL

## Medical College Management System

You are working on an existing Medical College Management System.

The project already contains:
* Public landing/website pages
* Authentication
* Role-based portal access
* Academic modules
* Clinical/Hospital modules
* Administration modules
* PostgreSQL/Supabase database
* Backend APIs
* Frontend portal pages
* Generic backend/domain engine
* Multiple CRUD-based modules

The existing architecture and working features MUST NOT be unnecessarily rewritten.

Your job is to perform a **deep production-readiness audit and implementation pass**.

Do NOT assume that something is complete merely because:
* the page loads,
* HTTP 200 is returned,
* an API exists,
* a database table exists,
* or an earlier audit says it is connected.

You must verify the complete chain:
**Frontend UI → API → Backend validation/business logic → Database → API response → Frontend state/UI**

If any part is incomplete, inconsistent, mocked, hardcoded, duplicated, weakly validated, or incorrectly connected, FIX IT.

---

# 1. UNDERSTAND THE EXISTING PROJECT

1. Inspect the complete repository/folder structure.
2. Identify:
   * frontend application
   * backend application
   * database/schema/migrations
   * API routes
   * domain/generic engine
   * authentication
   * RBAC
   * validation
   * shared components
   * API clients/hooks
   * forms
   * tables/lists
   * dashboard components
   * toast/notification system
   * loading/error/empty states
3. Map every frontend module to its backend API.
4. Map every backend API to its database table/query.
5. Identify generic CRUD APIs versus custom APIs.
6. Identify any mock/static/hardcoded data.
7. Identify duplicate logic.
8. Identify incomplete implementations.

---

# 2. GLOBAL FORM VALIDATION — FRONTEND + BACKEND

Every form in the entire application must be audited.
This includes:
* Login, Signup, User management, Student forms, Faculty forms, Doctor forms
* Patient forms, Admission forms, Appointment forms, Academic forms
* Attendance forms, Examination forms, Results, Fees, Finance
* Hospital/clinical forms (OPD/IPD, Emergency, Laboratory, Radiology, Pharmacy, Surgery, Blood bank, Insurance, Birth/death/MLC, Biomedical waste)
* Hostel, Library, HR/payroll, Inventory, Transport, Research, CMS, Notifications, Messages, Roles & permissions, Settings.

## Required-field UI
Every required field MUST clearly display:
`*`
Example:
* Full Name *
* Email *
* Phone *
* Password *

The required indicator must be consistent across the application.
Do not manually duplicate inconsistent asterisk styling everywhere. Reuse a common field/label pattern.

---

# 3. FRONTEND VALIDATION

Every form must have proper client-side validation:
* required fields, string length, min/max values, email format, phone format, password strength & confirmation, numeric, date ranges, select, enum values.
* Validation must happen BEFORE API submission.
* Errors must appear inline beside/under the relevant field.
* Do NOT rely only on toast messages for field validation.

---

# 4. BACKEND VALIDATION

Frontend validation is NOT security.
Every create/update API must perform server-side validation independently.
1. Parse request body.
2. Validate schema.
3. Sanitize/normalize input where appropriate.
4. Validate authenticated user.
5. Validate RBAC permission.
6. Validate business rules.
7. Validate related record existence.
8. Validate duplicate constraints where required.
9. Perform database operation.
10. Return structured response.

---

# 5. CONSISTENT API ERROR RESPONSE

Standardize backend error responses:
```json
{
  "success": false,
  "message": "Unable to create student",
  "errors": {
    "email": "Email already exists",
    "phone": "Phone number is already registered"
  }
}
```
For successful operations:
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {}
}
```
Never expose SQL errors, stack traces, or secrets to the frontend.

---

# 6. TOAST / NOTIFICATION SYSTEM

Audit every API mutation and user action:
* Disable/submit loading state
* Show success/error toast based on actual API result
* Do not show generic success toasts before the API completes or when it fails.

---

# 7. LIST / TABLE PAGES — API-FIRST ARCHITECTURE

Prefer:
```text
Frontend
   ↓
GET /api/... ?search=&page=&limit=&status=&sortBy=&sortOrder=
   ↓
Backend
   ↓
Database query
   ↓
Paginated result
```

---

# 8. SEARCH MUST BE SERVER-SIDE

Frontend sends search parameter to API. Safe parameterized queries on relevant fields.

---

# 9. FILTER MUST BE SERVER-SIDE

Frontend sends filter parameters (`status`, `department`, `batch`, `dateFrom`, `dateTo`). Multiple filters must work together with pagination.

---

# 10. PAGINATION MUST BE SERVER-SIDE & THEMED

Pagination response structure:
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8
  }
}
```
UI pagination design:
* Left: "Showing X to Y of Z results"
* Right: `«` (First), `<` (Prev), `[Page Numbers]`, `>` (Next), `»` (Last)
* Modern theme matching Medora (teal/emerald active state, subtle borders, rounded pills).

---

# 11. SORTING

Safe allow-list of sortable fields on the backend.

---

# 12. VIEW / EDIT / DELETE ACTIONS

Every list/table action (View, Edit, Delete, Approve, Reject, Sign-off, Publish) must be fully wired to backend APIs. Delete must never be frontend-only.

---

# 13. DELETE SAFETY

Confirmation dialog + Backend RBAC + Dependency / business rule check.

---

# 14. RBAC ON THE API

Backend is the authority: returns 403 Forbidden for unauthorized requests.

---

# 15. DASHBOARD — LIVE DATABASE DATA

No fake or static data. All cards, charts, recent activities, alerts come from live database endpoints.

---

# 16. DASHBOARD DATA RESPECTS RBAC

Roles only receive their authorized dashboard metrics.

---

# 17. LOADING / ERROR / EMPTY STATES

Skeleton/spinner during loading, empty state illustrations when count is 0, error messages with retry options.

---

# 18. DATABASE INTEGRITY & TRANSACTIONS

Multi-step operations execute in database transactions with proper rollback on failure.

---

# 19. AUDIT & VERIFICATION MATRIX

Deliverables:
- Implementation Summary
- Remaining Issues (if any)
- API Matrix (GET, POST, PUT/PATCH, DELETE, Search, Filter, Pagination, RBAC, Validation)
- Form Validation Matrix
- Dashboard Matrix
- List/Table Matrix
