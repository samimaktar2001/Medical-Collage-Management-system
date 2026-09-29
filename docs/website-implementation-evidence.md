# Selected option 1 — implementation evidence

Date: 29 September 2026. Status: implementation and automated checks complete for the selected visual slice; browser verification pending. This is not full website contract or college-scope completion.

## Delivered code

- Institutional utility bar, masthead, navigation, mobile menu, skip link, search and full footer, isolated from portal styling.
- Compact introductory section; CMS-backed categorized notice board; explicit separate unconfigured admission, form-window and seat-publication states; quick services; department links; labelled original campus illustration.
- Notice search/category/year/current/archive filters and pagination in URL; accessible detail and print control; consistent interior pages, sidebar, content timestamps and translation fallback.
- CMS fields for category, reference, issue/visibility/archive dates; published metadata snapshot, read-time IST date enforcement, draft isolation and publisher-controlled withdrawal.
- Additive migration `003_public_website.sql`; once-only synthetic content upgrade. Edited legacy content and business rows are preserved. Fixture changes carry an audit entry.
- Fuller synthetic programme, admissions, departments, faculty, research, hospital, facilities, student support, forms, calendar, policies and contact guidance. Content does not fabricate approvals, fees or real facilities.

## Checks

`npm test`: final rerun after date validation, draft-review-date isolation and search-count correction: 35 passed, 0 failed, 0 skipped; duration 17.82 seconds. Includes existing 30 domain/learning/HTTP tests and 5 website tests. Windows sandbox `uv_os_get_passwd ENOMEM` prevented the initial test launch; retry with process permissions succeeded.

`npm run build`: final API compilation and optimized Next build passed; dynamic institution, detail, notices and sitemap routes compiled. Next compilation 3.6 seconds; TypeScript 2.2 seconds.

`npm run typecheck`: passed. `npm run lint`: 0 errors, 14 existing explicit-any warnings. `npm run contracts`: regenerated from schema. Final `npm run contracts:check`: contracts match.

Browser: after the local server restarted, the surviving tab was on a connection-error page. Browser policy rejected selecting it due to its internal URL protocol. No alternate browser/automation workaround was used. User was asked to reopen the ordinary local HTTP URL. Current-run visual comparison, mobile interactions and editor-to-public browser rehearsal remain pending. Earlier baseline screenshots are not after-change proof.

## Real limitations

Structured global settings, content-owner checks, attachment files and scanning, notice corrections, dynamic admission cycles, public form drafts/submission/review, secure applicant tracking, email delivery and full content quality gates are not completed by this slice. Do not call it client-demo-ready for the entire contract or production-ready.

## Migration and startup

Run from project root with Node 22: `npm ci`, `npm run dev`. Startup checks migration checksums, adds the new columns and applies the synthetic fixture upgrade once. Do not edit old migrations or delete `.data/postgres`. Production login remains blocked. No deployment performed.
