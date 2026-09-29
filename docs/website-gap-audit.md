# Institutional website baseline review — 28 September 2026

This is a limited current-run visual and source review, not full application acceptance. The website upgrade and final completion documents are requirements, not proof of implementation. No application code or business data changed during this design review.

## Captured journey

1. **Homepage, narrow browser (~711px): poor task discovery.** Main navigation disappears without a replacement menu. The full-page capture shows a long alphabetical card catalogue; notices and admissions are not prominent. Strengths: explicit demonstration labelling, readable headings, no unsupported accreditation claims. Evidence: `website-audit/01-home-before.png`.
2. **Homepage, desktop (1440 × 1024): partial.** Navigation is visible, but the large promotional hero occupies most of the first screen. The first content cards are About, Alumni and Calendar instead of current notices/admissions. Evidence: `website-audit/01-home-desktop-before.png`.
3. **Programme/admissions destination: incomplete.** The programme link works using Enter. Content is a single paragraph and review date; programme details, cycle dates, document checklist, application tracking and three independent admissions statuses are absent from this page. Evidence: `website-audit/02-programmes-before.png`.

Screenshots were saved and inspected. An earlier full-page programme screenshot distorted layout and was rejected/replaced by the stable viewport capture. The temporary desktop viewport was reset. No form was submitted and no admin approval was performed.

## Feature-to-evidence baseline

| ID | User task | Current route/screenshot | Admin control | API | Data source | Current status | Missing behaviour | Priority | Fix | Verification evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| WEB-01/02 | Navigate college information | /institution; captures 1–2 | Header/footer hard-coded in layout | None for navigation | layout.tsx | partial | Layered identity, mobile menu, skip link, complete footer | P0 | Approved structured global settings and responsive navigation | Current-run visual findings only; full keyboard test unrun |
| WEB-03 | Manage site identity/menu | /institution | No structured site-settings editor identified | Not identified | Hard-coded layout | missing | Edit, review and publish global settings | P0 | Reuse CMS approvals with structured settings | Source review; persistence test unrun |
| WEB-04/05 | Publish controlled pages | /institution/[slug] | Existing content workflow | public/content | content | partial | Immutable revisions, scheduling, preview/diff, versioned rollback | P0 | Extend existing content model with new migrations | Existing test evidence is historical; not rerun here |
| WEB-06 | Read substantive programme information | /institution/programmes; capture 3 | Existing plain-body page editor | public/content | content | partial | Structured programme detail and relevant actions/documents | P0 | Programme template, ownership and publication validation | Current-run rendered text and screenshot |
| NTC-01–04 | Find current notices and documents | Homepage catalogue | Existing generic notices/content | Generic resources | notices/content | partial | Public dated notice lifecycle, filters, file versions, corrections, archives | P0 | Dedicated public projection and editor fields | Homepage evidence; notice workflow not exercised |
| ADM-W01–05 | Understand admissions and seat status | /institution/programmes | Internal application/seat controls only | Internal applications | applications/seat_pools | missing | Public cycle/window/verified-snapshot distinction | P0 | Separate publication entities; never derive official vacancies from demo pool | Current-run programme page; API implementation review still required |
| FRM-01–10 | Apply, resume, correct and track | No applicant action on programme page | No public form-builder journey verified | Not verified | Existing private documents are quarantined | untested | Versioned forms, protected drafts/submissions, review and acknowledgement | P0 | End-to-end form workflow preserving existing admissions source | No applicant acceptance claimed |
| SEC-01–03 | Protect private records | Outside this visual review | Existing role-scoped portal | Existing session/domain API | PostgreSQL | untested | Rerun negative authorization after changes | P0 | Preserve existing boundaries and add regression coverage | Not rerun in this review |
| UX-01–03 | Use mobile/keyboard/error states | Captures 1–3 | N/A | N/A | Rendered UI | partial | Mobile nav, complete content, error/loading verification | P0 | Responsive templates and real interaction checks | Enter navigation checked; screen reader/zoom/contrast not certified |
| REG-01 / OPS-01–02 | Preserve business data and recovery | Outside this visual review | Existing admin | Existing API | PostgreSQL | untested | Regression and restoration proof after implementation | P0 | Additive migrations; documented restore rehearsal | No new tests or restore run |

## Accessibility limits

The narrow layout has no replacement for hidden primary navigation. Enter activates the programme link. Heading and search labels are exposed in the browser tree. These observations do not establish WCAG compliance: focus order, contrast measurements, screen-reader announcements, zoom, phone breakpoints and form validation need dedicated checks.

## Design decision pending

Three built-in Image Gen concepts were created using the captured desktop screenshot and existing navy/teal tokens. They are design previews, not shipped UI or verified institutional content. Product Design's ideation workflow requires selection before implementation. Keep the existing Next/Nest/PostgreSQL project and preserve working admin data. Implement the selected design with real CMS/domain sources; do not turn image text into invented live institutional claims.

Available Figma, Canva and Vercel connector capabilities were inspected. No existing design-file references were supplied; no external files were created and no deployment or account permission changes were made.
