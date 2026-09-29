# Architecture

The browser calls same-origin `/api/v1/*`. Next.js rewrites to the loopback NestJS backend on port 4000. Public pages are server-rendered by Next.js using a server-only API fetch with `no-store`; publishing is immediately visible. Personalized data is never publicly cached.

NestJS owns sessions, role/record checks, Zod validation, SQL transactions, version checks, idempotency, audit and outbox writes. `Domain` is the current academic/finance/content service; `Learning` owns resources, submissions and student requests. The next refactor should split the large Domain service along the documented domain boundaries without duplicating authorization.

PostgreSQL relational tables carry institution identifiers and composite foreign keys on principal parent-child relationships. PGlite is a disk-backed PostgreSQL engine used only for development; `DATABASE_URL` selects the `pg` connection-pool adapter. Concurrency tests here exercise transactional invariants on PGlite; external multi-connection PostgreSQL concurrency still needs verification.

TanStack Query owns client server state. React Hook Form owns forms. Search/status/page filters live in the URL. Dialog and selection state stay local. No private state is persisted in browser storage. Logout revokes the session and clears the query cache.

Clinical systems remain entirely external. There is no patient chart table, chart endpoint, prescribing workflow or implicit admin clinical access.

Current deviations from the build prompt: npm locked install instead of pnpm workspace; parameterized SQL instead of Prisma; custom CSS/native accessible elements instead of Tailwind/shadcn; generated creation contracts without complete action typing; queued outbox records without Redis worker delivery. These are explicit implementation gaps/tradeoffs, not silent claims of exact stack compliance.
