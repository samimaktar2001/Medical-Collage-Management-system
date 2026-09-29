# Deployment

No live deployment was performed. The successful frontend build is a compilation result, not a production acceptance result. The backend refuses production startup until its development identity mechanism is replaced and release controls are reviewed.

The intended topology is HTTPS reverse proxy → Next.js and private NestJS → managed PostgreSQL, Redis workers and private object storage. Proxy `/api/v1` to the backend on the same public origin. Trust no arbitrary user/role/institution headers. Use separate migration and runtime database roles and separate staging/production resources.

The included Dockerfile is a **build/test container**, not a production app image. `docker build -t medora-validation .` then `docker run --rm medora-validation` runs isolated tests. Docker was not installed here, so this container path is unverified.

`infra/compose.yml` starts optional development PostgreSQL/Redis services on loopback. Supply `POSTGRES_PASSWORD` yourself. Set `DATABASE_URL` in your shell or `.env`; never commit real values. Local embedded PostgreSQL requires neither service. Redis is provided for the next worker milestone and is not currently used by application code.

Before deployment: complete remaining R0/R1 requirements, OIDC/MFA, private storage/scanner, provider adapters, worker delivery, reviewed institution policies, security review, browser/accessibility coverage, realistic PostgreSQL load tests and restore drill. Then provision staging, migrate once, seed no real-data environment, execute UAT and obtain institutional approval.

Release migrations are forward-only by default. Never restore an old snapshot over new legitimate transactions as a routine rollback. Preserve the previous immutable application image; use compatible expand/contract migrations and reconcile writes before any database recovery.
