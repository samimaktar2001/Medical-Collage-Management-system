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
