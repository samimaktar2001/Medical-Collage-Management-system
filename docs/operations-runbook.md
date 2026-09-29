# Operations runbook

## Local diagnostics

`GET /api/v1/health` tests the database and reports `production_ready:false`. A successful health response proves reachability, not domain acceptance. Next.js runs on 3000 and NestJS on 4000. Test API runs on 4100. Keep all bindings local during synthetic development.

Start with `npm run dev`. If a process fails, read its console error and check port ownership. Do not start two PGlite processes against `.data/postgres`. Stop the owning app before maintenance. Do not erase the data directory to “fix” a start error. `npm run db:migrate` should run while the normal embedded API is stopped.

## Integration state

Payment/HMIS/email/scanner are not connected. No control should report a successful provider transaction. The finance UI supports only explicitly verified offline references. All files remain quarantined. Outbox events persist, but delivery workers and retry/dead-letter management remain unimplemented; a pending event must not be described as delivered.

## Incident handling before live use

Appoint academic, finance, privacy and technical incident owners. For suspected data leakage, revoke sessions and contain access, preserve audit/database evidence, document affected objects and notify designated owners according to approved policy. Do not post student/patient data into public logs or AI prompts.

For a payment discrepancy, preserve the reference and idempotency key, compare against the authoritative provider/bank record, and reconcile through an authorized adjustment workflow; never directly edit paid totals. Such production reconciliation tooling is still pending.

Production monitoring must cover availability, authentication anomalies, queue depth, provider exceptions, stale integrations, storage growth and backups. There is no 24×7 support/SLA or production alerting integration in this deliverable.
